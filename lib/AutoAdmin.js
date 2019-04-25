"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@material-ui/core");
var Chip_1 = require("@material-ui/core/Chip");
var ra_core_1 = require("ra-core");
var React = require("react");
var react_admin_1 = require("react-admin");
var isEnum = function (type) { return typeof type === 'object' && !(type.attribute && type.type); };
var invertMap = function (map) {
    if (!map) {
        return false;
    }
    var invertedMap = {};
    Object.keys(map).forEach(function (key) { return (invertedMap[map[key]] = key); });
    return invertedMap;
};
var ListStringsField = function (_a) {
    var record = _a.record, source = _a.source, map = _a.map;
    var invertedMap = invertMap(map);
    return (React.createElement(React.Fragment, null, record[source].map(function (item) { return [
        React.createElement(Chip_1.default, { key: item, label: invertedMap && invertedMap[item] ? invertedMap[item] : item }),
        React.createElement(React.Fragment, null, " ")
    ]; })));
};
ListStringsField.defaultProps = { addLabel: true };
var enumToChoices = function (e) { return Object.keys(e).map(function (key) { return ({ id: e[key], name: key }); }); };
var UserAction = function (_a) {
    var record = _a.record, label = _a.label, action = _a.action;
    if (typeof action === 'function' && action.prototype && action.prototype.render) {
        var Action = action;
        return React.createElement(Action, { id: record.id });
    }
    if (typeof action === 'function') {
        var callback_1 = action;
        return (React.createElement(core_1.Button, { value: label, onClick: function () { return callback_1(record.id); } }, label));
    }
    return null;
};
var attributeToField = function (input) {
    if (Array.isArray(input.type) && input.type.length > 0) {
        var inputType = input.type[0];
        if (!input.label) {
            input.label = input.attribute;
        }
        if (isEnum(inputType)) {
            return React.createElement(ListStringsField, { label: input.label, source: input.attribute, map: inputType });
        }
        if (typeof inputType === 'string') {
            var _a = inputType.split('.'), reference = _a[0], sourceName = _a[1];
            return (React.createElement(react_admin_1.ReferenceArrayField, { label: input.label, linkType: 'show', source: input.attribute, reference: reference },
                React.createElement(react_admin_1.SingleFieldList, null,
                    React.createElement(react_admin_1.ChipField, { source: sourceName }))));
        }
        else {
            var inputTypeArray = input.type;
            return (React.createElement(react_admin_1.ArrayField, { label: input.label, source: input.attribute },
                React.createElement(react_admin_1.Datagrid, null, inputTypeArray.map(function (attribute) { return attributeToField(attribute); }))));
        }
    }
    if (input.action) {
        return React.createElement(UserAction, { label: input.label, action: input.action });
    }
    if (typeof input.type === 'string') {
        var _b = input.type.split('.'), reference = _b[0], sourceName = _b[1];
        return (React.createElement(react_admin_1.ReferenceField, { allowEmpty: true, label: input.label, linkType: 'show', source: input.attribute, reference: reference },
            React.createElement(react_admin_1.TextField, { source: sourceName })));
    }
    switch (input.type) {
        case Number:
            return React.createElement(react_admin_1.NumberField, { label: input.label, source: input.attribute, options: input.fieldOptions });
        case Boolean:
            return React.createElement(react_admin_1.BooleanField, { label: input.label, source: input.attribute, options: input.fieldOptions });
        case Date:
            return (React.createElement(react_admin_1.DateField, { label: input.label, showTime: input.fieldOptions && input.fieldOptions.showTime, source: input.attribute, options: input.fieldOptions }));
    }
    return React.createElement(react_admin_1.TextField, { label: input.label, source: input.attribute, options: input.fieldOptions });
};
var attributeToInput = function (input) {
    if (input.readOnly === true) {
        return attributeToField(input);
    }
    if (!input.label) {
        input.label = input.attribute;
    }
    if (Array.isArray(input.type) && input.type.length > 0) {
        var inputType = input.type[0];
        if (isEnum(inputType)) {
            return React.createElement(react_admin_1.SelectArrayInput, { label: input.label, source: input.attribute, choices: enumToChoices(inputType) });
        }
        if (typeof inputType === 'string') {
            var _a = inputType.split('.'), reference = _a[0], sourceName_1 = _a[1];
            var safeIfNull = function (choice) { return (choice ? choice[sourceName_1] : '?') || '??'; };
            return (React.createElement(react_admin_1.ReferenceArrayInput, { allowEmpty: true, label: input.label, reference: reference, source: input.attribute },
                React.createElement(react_admin_1.AutocompleteArrayInput, { optionText: safeIfNull })));
        }
        else {
            var inputTypeArray = input.type;
            return (React.createElement(react_admin_1.ArrayInput, { label: input.label, source: input.attribute },
                React.createElement(react_admin_1.SimpleFormIterator, null, inputTypeArray.map(function (attribute) { return attributeToInput(attribute); }))));
        }
    }
    if (input.action) {
        return React.createElement(UserAction, { label: input.label, action: input.action });
    }
    if (typeof input.type === 'string') {
        var _b = input.type.split('.'), reference = _b[0], sourceName = _b[1];
        return (React.createElement(react_admin_1.ReferenceInput, { allowEmpty: true, label: input.label, source: input.attribute, reference: reference, sort: { field: sourceName, order: 'ASC' } },
            React.createElement(react_admin_1.AutocompleteInput, { optionText: sourceName })));
    }
    switch (input.type) {
        case Number:
            return React.createElement(react_admin_1.NumberInput, { label: input.label, source: input.attribute, options: input.fieldOptions });
        case Boolean:
            return React.createElement(react_admin_1.BooleanInput, { label: input.label, source: input.attribute, options: input.fieldOptions });
        case Date:
            return input.fieldOptions && input.fieldOptions.showTime ? (React.createElement(react_admin_1.DateTimeInput, { label: input.label, source: input.attribute, options: input.fieldOptions })) : (React.createElement(react_admin_1.DateInput, { label: input.label, source: input.attribute, options: input.fieldOptions }));
    }
    if (isEnum(input.type)) {
        return (React.createElement(react_admin_1.SelectInput, { label: input.label, source: input.attribute, choices: enumToChoices(input.type), options: input.fieldOptions }));
    }
    if (input.extended) {
        return React.createElement(react_admin_1.LongTextInput, { label: input.label, source: input.attribute, options: input.fieldOptions });
    }
    return React.createElement(react_admin_1.TextInput, { label: input.label, source: input.attribute, options: input.fieldOptions });
};
var groupByTabs = function (schema) {
    var tabs = [];
    schema.forEach(function (attribute) {
        var added = false;
        tabs.forEach(function (tab) {
            var name = tab[0].tab;
            if (name === attribute.tab) {
                tab.push(attribute);
                added = true;
            }
        });
        if (!added) {
            tabs.push([attribute]);
        }
    });
    return tabs;
};
var tabbedForm = function (schema) {
    return (React.createElement(react_admin_1.TabbedForm, { validate: validate(schema) }, groupByTabs(schema).map(function (groupOfAttributes) { return (React.createElement(react_admin_1.FormTab, { label: groupOfAttributes[0].tab || 'Main' }, groupOfAttributes.map(function (attribute) { return attributeToInput(attribute); }))); })));
};
var referenceTab = function (reference) {
    return (React.createElement(react_admin_1.Tab, { key: reference.reference, label: reference.tab || reference.reference },
        React.createElement(react_admin_1.ReferenceManyField, { reference: reference.reference, target: reference.target, addLabel: false }, exports.AutoDataGrid({}, { schema: reference.schema }))));
};
var tabbedLayout = function (schema, references) {
    return (React.createElement(react_admin_1.TabbedShowLayout, null,
        groupByTabs(schema).map(function (groupOfAttributes) { return (React.createElement(react_admin_1.Tab, { label: groupOfAttributes[0].tab || 'Main' }, groupOfAttributes.map(attributeToField))); }),
        references && references.map(function (reference) { return referenceTab(reference); })));
};
var validate = function (schema) { return function (values) {
    var errors = {};
    schema.forEach(function (field) {
        if (field.validate) {
            console.log({ validate: field.attribute });
            try {
                errors[field.attribute] = field.validate(values[field.attribute]);
            }
            catch (e) {
                errors[field.attribute] = 'Validation threw an exception: ' + e;
            }
        }
    });
    return errors;
}; };
exports.AutoFilter = function (props) { return (React.createElement(react_admin_1.Filter, __assign({}, props),
    React.createElement(react_admin_1.TextInput, { label: 'Search', source: 'q', alwaysOn: true }))); };
var AutoTitle = function (_a) {
    var record = _a.record, schema = _a.schema;
    return React.createElement("span", null,
        "Edit ",
        record ? "\"" + record[schema[0].attribute] + "\"" : '');
};
exports.AutoCreate = function (props, _a) {
    var schema = _a.schema;
    return (React.createElement(react_admin_1.Create, __assign({ title: 'Create a course' }, props), tabbedForm(schema)));
};
exports.AutoShow = function (props, _a) {
    var schema = _a.schema, references = _a.references;
    return (React.createElement(react_admin_1.Show, __assign({ title: React.createElement(AutoTitle, { schema: schema }) }, props), tabbedLayout(schema, references)));
};
exports.AutoEdit = function (props, _a) {
    var schema = _a.schema;
    return (React.createElement(react_admin_1.Edit, __assign({ title: React.createElement(AutoTitle, { schema: schema }) }, props), tabbedForm(schema)));
};
exports.AutoDataGrid = function (props, _a) {
    var schema = _a.schema;
    var schemaIncludesId = schema.filter(function (attribute) { return attribute.attribute === 'id'; }).length !== 0;
    return (React.createElement(react_admin_1.Datagrid, null,
        !schemaIncludesId && (React.createElement(react_admin_1.TextField, { source: 'id', onClick: (props &&
                props.record &&
                (function () {
                    document.location = ra_core_1.linkToRecord(props.basePath, props.record.id, 'show');
                })) ||
                undefined })),
        schema.filter(function (attribute) { return attribute.inList !== false; }).map(attributeToField),
        React.createElement(react_admin_1.ShowButton, { basePath: props.basePath })));
};
exports.AutoList = function (props, _a) {
    var schema = _a.schema;
    return (React.createElement(react_admin_1.List, __assign({}, props, { filters: React.createElement(exports.AutoFilter, null) }), exports.AutoDataGrid(props, { schema: schema })));
};
exports.AutoResource = function (modelName, _a) {
    var schema = _a.schema, references = _a.references;
    var list = function (props) { return exports.AutoList(props, { schema: schema }); };
    var show = function (props) { return exports.AutoShow(props, { schema: schema, references: references }); };
    var edit = function (props) { return exports.AutoEdit(props, { schema: schema }); };
    var create = function (props) { return exports.AutoCreate(props, { schema: schema }); };
    var icon = 'address-book';
    return React.createElement(react_admin_1.Resource, { name: modelName, list: list, show: show, edit: edit, create: create, icon: icon });
};
//# sourceMappingURL=AutoAdmin.js.map