import Chip from '@material-ui/core/Chip';
import { linkToRecord } from 'ra-core';
import * as React from 'react';
import {
  ArrayField,
  ArrayInput,
  AutocompleteInput,
  Create,
  Datagrid,
  DisabledInput,
  Edit,
  Filter,
  List,
  NumberField,
  NumberInput,
  ReferenceField,
  ReferenceInput,
  Resource,
  SelectArrayInput,
  SelectInput,
  Show,
  ShowButton,
  SimpleForm,
  SimpleFormIterator,
  SimpleShowLayout,
  TextField,
  TextInput
} from 'react-admin';

interface AutoAdminAttribute {
  attribute: string;
  type: string | Object | NumberConstructor | StringConstructor | AutoAdminAttribute[];
  inList?: boolean;
  readOnly?: boolean;
}

const isEnum = (type: any) => typeof type === 'object' && !(type.attribute && type.type);

const invertMap = (map: any) => {
  if (!map) {
    return false;
  }
  let invertedMap: any = {};
  Object.keys(map).forEach(key => (invertedMap[map[key]] = key));
  return invertedMap;
};

const ListStringsField = ({ record, source, map }: { record?: any; source: string; map?: any }) => {
  const invertedMap = invertMap(map);
  return (
    <>
      {record[source].map((item: string) => [
        <Chip key={item} label={invertedMap && invertedMap[item] ? invertedMap[item] : item} />,
        <> </>
      ])}
    </>
  );
};
ListStringsField.defaultProps = { addLabel: true };

const enumToChoices = (e: any) => Object.keys(e).map((key: string) => ({ id: e[key], name: key }));

const attributeToField = (input: AutoAdminAttribute) => {
  if (Array.isArray(input.type)) {
    /* Array of enum values – We use a SelectArrayInput */
    if (input.type.length > 0 && isEnum(input.type[0])) {
      return <ListStringsField source={input.attribute} map={input.type[0]} />;
    }
    return (
      <ArrayField source={input.attribute}>
        <Datagrid>{input.type.map(attribute => attributeToField(attribute))}</Datagrid>
      </ArrayField>
    );
  }
  if (typeof input.type === 'string') {
    const [reference, sourceName] = input.type.split('.');
    return (
      <ReferenceField linkType="show" source={input.attribute} reference={reference}>
        <TextField source={sourceName} />
      </ReferenceField>
    );
  }
  switch (input.type) {
    case String:
      return <TextField source={input.attribute} />;
    case Number:
      return <NumberField source={input.attribute} />;
  }
  return <TextField source={input.attribute} />;
};

const attributeToInput = (input: AutoAdminAttribute) => {
  if (Array.isArray(input.type)) {
    /* Array of enum values – We use a SelectArrayInput */
    if (input.type.length > 0 && isEnum(input.type[0])) {
      return <SelectArrayInput source={input.attribute} choices={enumToChoices(input.type[0])} />;
    }
    /* Recurse */
    return (
      <ArrayInput source={input.attribute}>
        <SimpleFormIterator>{input.type.map(attribute => attributeToInput(attribute))}</SimpleFormIterator>
      </ArrayInput>
    );
  }

  /* Special cases – Passing strings, passing enums */
  if (typeof input.type === 'string') {
    /* table.field */
    const [reference, sourceName] = input.type.split('.');
    return (
      <ReferenceInput source={input.attribute} reference={reference} sort={{ field: sourceName, order: 'ASC' }}>
        <AutocompleteInput optionText={sourceName} />
      </ReferenceInput>
    );
  }

  switch (input.type) {
    case String:
      return <TextInput source={input.attribute} />;
    case Number:
      return <NumberInput source={input.attribute} />;
  }
  if (isEnum(input.type)) {
    return <SelectInput source={input.attribute} choices={enumToChoices(input.type)} />;
  }
  return <TextInput source={input.attribute} />;
};

export const AutoFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn={true} />
  </Filter>
);
const AutoTitle = ({ record, schema }: { record?: any; schema: AutoAdminAttribute[] }) => {
  return <span>Edit {record ? `"${record[schema[0].attribute]}"` : ''}</span>;
};

export const AutoCreate = (props: any, { schema }: { schema: AutoAdminAttribute[] }) => {
  return (
    <Create title="Create a course" {...props}>
      <SimpleForm>{schema.map(attributeToInput)}</SimpleForm>
    </Create>
  );
};

export const AutoShow = (props: any, { schema }: { schema: AutoAdminAttribute[] }) => {
  return (
    <Show title={<AutoTitle schema={schema} />} {...props}>
      <SimpleShowLayout>
        <TextField source="id" />
        {schema.map(attributeToField)}
      </SimpleShowLayout>
    </Show>
  );
};

export const AutoEdit = (props: any, { schema }: { schema: AutoAdminAttribute[] }) => {
  return (
    <Edit title={<AutoTitle schema={schema} />} {...props}>
      <SimpleForm>
        <DisabledInput source="id" />
        {schema.map(
          attribute => (attribute.readOnly !== true ? attributeToInput(attribute) : attributeToField(attribute))
        )}
      </SimpleForm>
    </Edit>
  );
};

export const AutoList = (props: any, { schema }: { schema: AutoAdminAttribute[] }) => {
  return (
    <List {...props} filters={<AutoFilter />}>
      <Datagrid>
        <TextField
          source="id"
          onClick={() => (document.location = linkToRecord(props.basePath, props.record.id, 'show'))}
        />
        {schema.filter(attribute => attribute.inList !== false).map(attributeToField)}
        <ShowButton basePath={props.basePath} />
      </Datagrid>
    </List>
  );
};

export const AutoResource = (modelName: string, { schema }: { schema: AutoAdminAttribute[] }) => {
  const list = (props: any) => AutoList(props, { schema });
  const show = (props: any) => AutoShow(props, { schema });
  const edit = (props: any) => AutoEdit(props, { schema });
  const create = (props: any) => AutoCreate(props, { schema });
  const icon = 'address-book';

  return <Resource name={modelName} list={list} show={show} edit={edit} create={create} icon={icon} />;
};
