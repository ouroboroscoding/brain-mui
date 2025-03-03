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
import { empty, merge, omap } from '@ouroboros/tools';
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
    const [permissions, permissionsSet] = useState({});
    const [portals, portalsSet] = useState([]);
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
            permissionsSet(data);
            if (!empty(permissions)) {
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
    // Portals / permissions effect
    useEffect(() => {
        // Set the portals from the keys
        portalsSet(Object.keys(props.portals));
        // Copy the possible portals
        const oPortals = clone(props.portals);
        // Go through each passed permission
        for (const sPortal of Object.keys(permissions)) {
            // Remove it from the remaining
            delete oPortals[sPortal];
        }
        // Store the new remaining
        remainingSet(Object.keys(oPortals));
    }, [props.portals, permissions]);
    // Called when any permission is changed
    function change(name, val) {
        // Clone the current values
        const dPermissions = clone(permissions);
        // If we got null, remove all rights
        if (val === null) {
            delete dPermissions[portals[tab]][name];
        }
        // Else, update / add the rights
        else {
            dPermissions[portals[tab]][name] = val;
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
            return { ...val, portal: {} };
        });
        // Remove the portal from the remaining
        remainingSet((val) => {
            const i = val.indexOf(portal);
            if (i !== -1) {
                const l = [...val];
                l.splice(i, 1);
                return l;
            }
            else {
                return val;
            }
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
            items: [...remaining]
        });
    }
    // Called to update permissions
    function update() {
        // Update the permissions
        brain.update('permissions', {
            _user: props.value._id,
            _portal: portals[tab],
            rights: permissions[portals[tab]]
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
                if (portal !== Object.keys(permissions).length) {
                    tabSet(portal);
                }
            }, scrollButtons: "auto", value: tab, variant: "scrollable" },
            omap(permissions, ((o, p) => React.createElement(Tab, { key: p, label: props.portals[p] }))),
            remaining.length > 0 &&
                React.createElement(Tab, { icon: React.createElement("i", { className: "fa-solid fa-plus" }), onClick: portalAddMenu })),
        portalMenu !== false &&
            React.createElement(Menu, { anchorEl: portalMenu.element, open: true, onClose: () => portalMenuSet(false) }, portalMenu.items.map(s => React.createElement(MenuItem, { key: s, onClick: () => {
                    portalMenuSet(false);
                    portalAdd(s);
                } }, props.portals[s]))),
        tab > -1 && props.sections.map(section => React.createElement(Paper, { key: section.title, className: "permissions" },
            React.createElement(Grid, { container: true, spacing: 0 },
                React.createElement(Grid, { item: true, xs: 12, md: 6, className: "group_title" }, section.title),
                React.createElement(Grid, { item: true, xs: 2, md: 1, className: "right_title" }, "All"),
                React.createElement(Grid, { item: true, xs: 2, md: 1, className: "right_title" }, "Create"),
                React.createElement(Grid, { item: true, xs: 2, md: 1, className: "right_title" }, "Read"),
                React.createElement(Grid, { item: true, xs: 2, md: 1, className: "right_title" }, "Update"),
                React.createElement(Grid, { item: true, xs: 2, md: 1, className: "right_title" }, "Delete"),
                section.rights.map(perm => React.createElement(Permission, { allowed: perm.allowed, key: perm.name, labels: labelsRef.current, name: perm.name, onChange: change, title: perm.title, value: (permissions &&
                        permissions[portals[tab]] &&
                        permissions[portals[tab]][perm.name]) || {} })),
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
    portals: PropTypes.object.isRequired,
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
