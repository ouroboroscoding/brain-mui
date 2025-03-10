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
import brain, { RIGHTS_ALL_ID } from '@ouroboros/brain';
import clone from '@ouroboros/clone';
import { afindi, arrayFindDelete, empty, merge } from '@ouroboros/tools';
// NPM modules
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
// Material UI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
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
    const [permissions, permissionsSet] = useState([]);
    const [tab, tabSet] = useState(-1);
    const [portalMenu, portalMenuSet] = useState(false);
    const [remaining, remainingSet] = useState([]);
    // Refs
    const labelsRef = useRef({ [RIGHTS_ALL_ID]: '*' });
    // Load effect
    useEffect(() => {
        brain.read('permissions', {
            user: props.value._id
        }).then(data => {
            for (const o of data) {
                const i = afindi(props.portals, 'key', o.portal);
                o.title = i > -1 ? props.portals[i].title : 'UNKNOWN';
            }
            permissionsSet(data);
            if (permissions.length > 0) {
                tabSet(0);
            }
        });
    }, [props.value]);
    // IDs effect
    useEffect(() => {
        // Start with the ALL
        const oIDs = { [RIGHTS_ALL_ID]: '*' };
        // If we have IDs
        if (props.ids && props.ids.length) {
            merge(oIDs, props.ids);
        }
        // Store the new ref
        labelsRef.current = oIDs;
    }, [props.ids]);
    // Remaining effect
    useEffect(() => {
        // Copy the possible portals
        const lPortals = clone(props.portals);
        // Go through each passed permission
        for (const o of permissions) {
            // Remove it from the remaining
            arrayFindDelete(lPortals, 'key', o.portal);
        }
        // Store the new remaining
        remainingSet(lPortals);
    }, [props.portals, permissions]);
    // Called when any permission is changed
    function change(name, val) {
        // Clone the current values
        const dPermissions = clone(permissions);
        // If we got null, or an empty object, remove all rights
        if (empty(val)) {
            delete dPermissions[tab].rights[name];
        }
        // Else, update / add the rights
        else {
            dPermissions[tab].rights[name] = val;
        }
        // Update the state
        permissionsSet(dPermissions);
    }
    // Called to add a portal to the permissions
    function portalAdd(portal) {
        // Get the current length of the permissions
        const iLength = permissions.length;
        // Add the portal to the data
        permissionsSet((val) => {
            const lPerms = clone(val);
            lPerms.push({
                portal: portal.key,
                rights: {},
                title: portal.title
            });
            return lPerms;
        });
        // Remove the portal from the remaining
        remainingSet((val) => {
            return arrayFindDelete(val, 'key', portal.key, true);
        });
        // Set the new tab
        tabSet(iLength);
    }
    // Called to display the menu to add a location to the order
    function portalAddMenu(ev) {
        // Stop any other events
        ev.preventDefault();
        ev.stopPropagation();
        // Set the menu
        portalMenuSet({
            element: ev.target,
            items: clone(remaining)
        });
    }
    // Called to update permissions
    function update() {
        // Update the permissions
        brain.update('permissions', {
            user: props.value._id,
            portal: permissions[tab].portal,
            rights: permissions[tab].rights
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
        React.createElement(Tabs, { onChange: (ev, portal) => {
                if (portal !== permissions.length) {
                    tabSet(portal);
                }
            }, scrollButtons: "auto", value: tab, variant: "scrollable" },
            permissions.map(o => React.createElement(Tab, { key: o.portal, label: o.title })),
            remaining.length > 0 &&
                React.createElement(Tab, { icon: React.createElement("i", { className: "fa-solid fa-plus" }), onClick: portalAddMenu })),
        portalMenu !== false &&
            React.createElement(Menu, { anchorEl: portalMenu.element, open: true, onClose: () => portalMenuSet(false) }, portalMenu.items.map(o => React.createElement(MenuItem, { key: o.key, onClick: () => {
                    portalMenuSet(false);
                    portalAdd(o);
                } }, o.title))),
        tab > -1 && props.sections.map(section => React.createElement(Paper, { key: section.title, className: "permissions" },
            React.createElement(Grid, { container: true, spacing: 0 },
                React.createElement(Grid, { item: true, xs: 12, md: 6, className: "group_title" }, section.title),
                React.createElement(Grid, { item: true, xs: 2, md: 1, className: "right_title" }, "All"),
                React.createElement(Grid, { item: true, xs: 2, md: 1, className: "right_title" }, "Create"),
                React.createElement(Grid, { item: true, xs: 2, md: 1, className: "right_title" }, "Read"),
                React.createElement(Grid, { item: true, xs: 2, md: 1, className: "right_title" }, "Update"),
                React.createElement(Grid, { item: true, xs: 2, md: 1, className: "right_title" }, "Delete"),
                section.rights.map(perm => React.createElement(Permission, { allowed: perm.allowed, key: perm.name, labels: labelsRef.current, name: perm.name, onChange: change, title: perm.title, value: (permissions &&
                        permissions[tab] &&
                        permissions[tab].rights[perm.name]) || {} })),
                React.createElement(Grid, { item: true, xs: 2, md: 1 }, "\u00A0")))),
        React.createElement(Box, { className: "actions" },
            React.createElement(Button, { variant: "contained", color: "secondary", onClick: props.onClose }, "Cancel"),
            React.createElement(Button, { variant: "contained", color: "primary", onClick: update }, "Update"))));
}
// Force props
Permissions.propTypes = {
    ids: PropTypes.objectOf(PropTypes.string),
    onClose: PropTypes.func.isRequired,
    onUpdate: PropTypes.func,
    portals: PropTypes.arrayOf(PropTypes.exact({
        key: PropTypes.string,
        title: PropTypes.string.isRequired
    })).isRequired,
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
