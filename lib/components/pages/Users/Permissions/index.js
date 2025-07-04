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
import { empty, merge } from '@ouroboros/tools';
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
export default function Permissions({ ids, onClose, onUpdate, portals, value }) {
    // State
    const [permissions, permissionsSet] = useState({});
    const [tab, tabSet] = useState(false);
    const [tabs, tabsSet] = useState([]);
    const [portalMenu, portalMenuSet] = useState(false);
    const [remaining, remainingSet] = useState([]);
    // Refs
    const labelsRef = useRef({ [RIGHTS_ALL_ID]: '*' });
    // Load effect
    useEffect(() => {
        brain.read('permissions', {
            user: value._id
        }).then(data => {
            permissionsSet(data);
            if (!empty(permissions)) {
                tabSet(Object.keys(permissions)[0]);
            }
        });
    }, [value]);
    // IDs effect
    useEffect(() => {
        // Start with the ALL
        const oIDs = { [RIGHTS_ALL_ID]: '*' };
        // If we have IDs
        if (ids && ids.length) {
            merge(oIDs, ids);
        }
        // Store the new ref
        labelsRef.current = oIDs;
    }, [ids]);
    // Portals / permissions effect
    useEffect(() => {
        // Init the list of actual keys, and possible keys
        const aTabs = [];
        const aRemaining = [];
        // Go through each possible permission
        for (const sPortal of Object.keys(portals)) {
            // If we have the permission
            if (sPortal in permissions) {
                aTabs.push(sPortal);
            }
            else {
                aRemaining.push(sPortal);
            }
        }
        // Store the new tabs and remaining
        tabsSet(aTabs);
        remainingSet(aRemaining);
    }, [portals, permissions]);
    // Called when any permission is changed
    function change(name, val) {
        // Clone the current values
        const dPermissions = { ...permissions };
        // If we got null, remove all rights
        if (empty(val)) {
            delete dPermissions[tab][name];
        }
        // Else, update / add the rights
        else {
            dPermissions[tab][name] = val;
        }
        // Update the state
        permissionsSet(dPermissions);
    }
    // Called to add a portal to the permissions
    function portalAdd(portal) {
        // Get the current length of the permissions
        const iLength = Object.keys(permissions).length;
        // Add the portal to the data
        permissionsSet((val) => {
            return { ...val, [portal]: {} };
        });
        // Set the new tab
        tabSet(portal);
    }
    // Called to display the menu to add a location to the order
    function portalAddMenu(ev) {
        // Stop any other events
        ev.preventDefault();
        ev.stopPropagation();
        // Set the menu
        portalMenuSet({
            element: ev.target,
            items: [...remaining]
        });
    }
    // Called to update permissions
    function update() {
        // Update the permissions
        brain.update('permissions', {
            user: value._id,
            portal: tab,
            rights: permissions[tab]
        }).then((data) => {
            if (data) {
                if (onUpdate) {
                    onUpdate();
                }
                onClose();
            }
        });
    }
    // Tab
    let tabIndex = tabs.indexOf(tab);
    if (tabIndex < 0) {
        tabIndex = false;
    }
    // Render
    return (React.createElement(React.Fragment, null,
        React.createElement(Tabs, { onChange: (ev, i) => {
                if (i !== Object.keys(permissions).length) {
                    tabSet(tabs[i]);
                }
            }, scrollButtons: "auto", value: tabIndex, variant: "scrollable" },
            tabs.map(p => React.createElement(Tab, { key: p, label: portals[p].title })),
            !empty(remaining) &&
                React.createElement(Tab, { icon: React.createElement("i", { className: "fa-solid fa-plus" }), onClick: portalAddMenu })),
        portalMenu !== false &&
            React.createElement(Menu, { anchorEl: portalMenu.element, open: true, onClose: () => portalMenuSet(false) }, portalMenu.items.map(s => React.createElement(MenuItem, { key: s, onClick: () => {
                    portalMenuSet(false);
                    portalAdd(s);
                } }, portals[s].title))),
        tab !== false && portals[tab].permissions.map(section => React.createElement(Paper, { key: section.title, className: "permissions" },
            React.createElement(Grid, { container: true, spacing: 0 },
                React.createElement(Grid, { item: true, xs: 12, md: 6, className: "group_title" }, section.title),
                React.createElement(Grid, { item: true, xs: 2, md: 1, className: "right_title" }, "All"),
                React.createElement(Grid, { item: true, xs: 2, md: 1, className: "right_title" }, "Create"),
                React.createElement(Grid, { item: true, xs: 2, md: 1, className: "right_title" }, "Read"),
                React.createElement(Grid, { item: true, xs: 2, md: 1, className: "right_title" }, "Update"),
                React.createElement(Grid, { item: true, xs: 2, md: 1, className: "right_title" }, "Delete"),
                section.rights.map(perm => React.createElement(Permission, { allowed: perm.allowed, key: perm.name, labels: labelsRef.current, name: perm.name, onChange: change, title: perm.title, value: (permissions &&
                        permissions[tab] &&
                        permissions[tab][perm.name]) || {} })),
                React.createElement(Grid, { item: true, xs: 2, md: 1 }, "\u00A0")))),
        React.createElement(Box, { className: "actions" },
            React.createElement(Button, { variant: "contained", color: "secondary", onClick: onClose }, "Cancel"),
            React.createElement(Button, { variant: "contained", color: "primary", onClick: update }, "Update"))));
}
// Force props
Permissions.propTypes = {
    ids: PropTypes.objectOf(PropTypes.string),
    onClose: PropTypes.func.isRequired,
    onUpdate: PropTypes.func,
    portals: PropTypes.objectOf(PropTypes.exact({
        title: PropTypes.string.isRequired,
        permissions: PropTypes.arrayOf(PropTypes.exact({
            title: PropTypes.string.isRequired,
            rights: PropTypes.arrayOf(PropTypes.exact({
                name: PropTypes.string.isRequired,
                title: PropTypes.string.isRequired,
                allowed: PropTypes.number.isRequired
            }))
        })).isRequired
    })).isRequired,
    value: PropTypes.shape({
        _id: PropTypes.string.isRequired
    })
};
