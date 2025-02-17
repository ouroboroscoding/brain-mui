/**
 * Permission
 *
 * Handles a set of rights for a single permission
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-03-06
 */
import clone from '@ouroboros/clone';
import { omap } from '@ouroboros/tools';
// NPM modules
import PropTypes from 'prop-types';
import React, { useState } from 'react';
// Material UI
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
// Local modules
import IdAdd from './IdAdd';
import IdEdit from './IdEdit';
/**
 * Permission
 *
 * Handles a single permission record
 *
 * @name Permission
 * @access public
 * @param props Properties passed to the component
 * @returns React.Component
 */
export default function Permission(props) {
    // State
    const [add, addSet] = useState(false);
    // Called when a new ID is to be added
    function idAdded(id, rights) {
        // If the rights are empty, do nothing
        if (rights === 0) {
            return;
        }
        // Clone the current rights
        const oRights = clone(props.value);
        // Add the record
        oRights[id] = rights;
        // Let the parent know
        props.onChange(props.name, oRights);
        // Clear the form
        addSet(false);
    }
    // Called when any rights are changed
    function idChanged(id, rights) {
        // Clone the current rights
        const oRights = clone(props.value);
        // Add or update the existing rights
        oRights[id] = rights;
        // Let the parent know
        props.onChange(props.name, oRights);
    }
    // Called to drop a right completely
    function idDropped(id) {
        // If the ID exists
        if (id in props.value) {
            // Clone the current rights
            const oRights = clone(props.value);
            // Drop the right
            delete oRights[id];
            // Let the parent know
            props.onChange(props.name, oRights);
        }
    }
    // Render
    return (React.createElement(React.Fragment, null,
        React.createElement(Grid, { item: true, xs: 10, className: "name" }, props.title),
        React.createElement(Grid, { item: true, xs: 2, className: "right_title" },
            React.createElement(Tooltip, { title: "Add ID" },
                React.createElement(IconButton, { onClick: () => addSet(b => !b) },
                    React.createElement("i", { className: 'fa-solid fa-plus' + (add ? ' open' : '') })))),
        omap(props.value, (v, k, i) => React.createElement(IdEdit, { allowed: props.allowed, ident: k, key: k, labels: props.labels, onChange: idChanged, onDrop: idDropped, value: v })),
        add &&
            React.createElement(IdAdd, { allowed: props.allowed, labels: props.labels, onSave: idAdded })));
}
// Force props
Permission.propTypes = {
    allowed: PropTypes.number.isRequired,
    labels: PropTypes.objectOf(PropTypes.string).isRequired,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    value: PropTypes.objectOf(PropTypes.number).isRequired
};
