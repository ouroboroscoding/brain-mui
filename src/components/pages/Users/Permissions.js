/**
 * Permissions
 *
 * Handles permissions associated with a User
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-03-06
 */
// Ouroboros modules
import brain from '@ouroboros/brain';
import clone from '@ouroboros/clone';
// NPM modules
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
// Material UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
// Local components
import Permission from './Permission';
/**
 * Permissions
 *
 * Shows all permissions for a specific user
 *
 * @name Permissions
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
export default function Permissions(props) {
    // State
    const [permissions, permissionsSet] = useState(false);
    // Load effect
    useEffect(() => {
        brain.read('permissions', {
            user: props.value._id
        }).then(permissionsSet);
    }, [props.value]);
    // Called when any permission is changed
    function change(name, val) {
        // Clone the current values
        const dPermissions = clone(permissions);
        // If we don't have the name yet
        if (!dPermissions.rights[name]) {
            dPermissions.rights[name] = 0;
        }
        // Set the rights
        if (val) {
            dPermissions.rights[name] = val;
        }
        // Else, remove the permission
        else {
            delete dPermissions.rights[name];
        }
        // Update the state
        permissionsSet(dPermissions);
    }
    // Called to update permissions
    function update() {
        // Update the permissions
        brain.update('permissions', {
            user: props.value._id,
            rights: permissions.rights
        }).then((data) => {
            if (data) {
                if (props.onUpdate) {
                    props.onUpdate();
                }
                props.onClose();
            }
        });
    }
    // Render
    return (React.createElement(React.Fragment, null,
        props.sections.map(section => React.createElement(Paper, { key: section.title, className: "permissions" },
            React.createElement(Grid, { container: true, spacing: 2 },
                React.createElement(Grid, { item: true, md: 2, xs: 7, className: "group_title" }, section.title),
                React.createElement(Grid, { item: true, md: 2, xs: 1, className: "right_title" }, "All"),
                React.createElement(Grid, { item: true, md: 2, xs: 1, className: "right_title" }, "Create"),
                React.createElement(Grid, { item: true, md: 2, xs: 1, className: "right_title" }, "Read"),
                React.createElement(Grid, { item: true, md: 2, xs: 1, className: "right_title" }, "Update"),
                React.createElement(Grid, { item: true, md: 2, xs: 1, className: "right_title" }, "Delete"),
                section.rights.map(perm => React.createElement(Permission, { allowed: perm.allowed, key: perm.name, name: perm.name, onChange: change, title: perm.title, value: (permissions && permissions.rights[perm.name]) || 0 }))))),
        React.createElement(Box, { className: "actions" },
            React.createElement(Button, { variant: "contained", color: "secondary", onClick: props.onClose }, "Cancel"),
            React.createElement(Button, { variant: "contained", color: "primary", onClick: update }, "Update"))));
}
// Force props
Permissions.propTypes = {
    onClose: PropTypes.func.isRequired,
    onUpdate: PropTypes.func,
    sections: PropTypes.arrayOf(PropTypes.exact({
        title: PropTypes.string.isRequired,
        rights: PropTypes.arrayOf(PropTypes.exact({
            name: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            allowed: PropTypes.number.isRequired
        }))
    })).isRequired,
    value: PropTypes.shape({
        _id: PropTypes.string.isRequired
    })
};
