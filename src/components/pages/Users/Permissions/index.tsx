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

// Types
export type PermissionsProps = {
	ids?: Record<string, string>,
	onClose: () => void,
	onUpdate?: () => void,
	portals: PortalsStruct,
	value: Record<string, Record<string, number>>
}
export type PermissionsRecord = Record<string, Record<string, number>>
export type PermissionStruct = {
	name: string,
	title: string,
	allowed: number
}
export type PortalsStruct = {
	[x: string]: {
		title: string,
		permissions: SectionStruct[]
	}
};
type portalMenuStruct = {
	element: any,
	items: string[]
}
export type SectionStruct = {
	title: string,
	rights: PermissionStruct[]
}

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
export default function Permissions(
	{ ids, onClose, onUpdate, portals, value }: PermissionsProps
) {

	// State
	const [ permissions, permissionsSet ] = useState<Record<string, PermissionsRecord>>({ });
	const [ tab, tabSet ] = useState<number | false>(false);
	const [ tabs, tabsSet ] = useState<string[]>([ ]);
	const [ portalMenu, portalMenuSet ] = useState<portalMenuStruct | false>(false);
	const [ remaining, remainingSet ] = useState<string[]>([ ]);

	// Refs
	const labelsRef = useRef({ [RIGHTS_ALL_ID]: '*' });

	// Load effect
	useEffect(() => {
		brain.read('permissions', {
			user: value._id
		}).then(data => {
			permissionsSet(data);
			if(!empty(permissions)) {
				tabSet(0);
			}
		});
	}, [ value ]);

	// IDs effect
	useEffect(() => {

		// Start with the ALL
		const oIDs = { [RIGHTS_ALL_ID]: '*' };

		// If we have IDs
		if(ids && ids.length) {
			merge(oIDs, ids);
		}

		// Store the new ref
		labelsRef.current = oIDs;

	}, [ ids ]);

	// Portals / permissions effect
	useEffect(() => {

		// Init the list of actual keys, and possible keys
		const aTabs: string[] = [];
		const aRemaining: string[] = [];

		// Go through each possible permission
		for(const sPortal of Object.keys(portals)) {

			// If we have the permission
			if(sPortal in permissions) {
				aTabs.push(sPortal);
			} else {
				aRemaining.push(sPortal);
			}
		}

		// Store the new tabs and remaining
		tabsSet(aTabs);
		remainingSet(aRemaining);

	}, [ portals, permissions ])

	// Called when any permission is changed
	function change(name: string, val: Record<string, number> | null) {

		// Clone the current values
		const dPermissions = { ...permissions };

		// If we got null, remove all rights
		if(empty(val)) {
			delete dPermissions[tabs[tab as number]][name];
		}

		// Else, update / add the rights
		else {
			dPermissions[tabs[tab as number]][name] = val as Record<string, number>;
		}

		// Update the state
		permissionsSet(dPermissions);
	}

	// Called to add a portal to the permissions
	function portalAdd(portal: string) {

		// Get the current length of the permissions
		const iLength = Object.keys(permissions).length;

		// Add the portal to the data
		permissionsSet((val: Record<string, PermissionsRecord>) => {
			return { ...val, [portal]: {} } as Record<string, PermissionsRecord>;
		});

		// Remove the portal from the remaining
		remainingSet((val: string[]) => {
			const i = val.indexOf(portal);
			if(i !== -1) {
				const l = [ ...val ];
				l.splice(i, 1);
				return l;
			} else {
				return val;
			}
		});

		// Set the new tab
		tabSet(iLength);
	}

	// Called to display the menu to add a location to the order
	function portalAddMenu(ev: React.MouseEvent<HTMLElement>) {

		// Stop any other events
		ev.preventDefault();
		ev.stopPropagation();

		// Set the menu
		portalMenuSet({
			element: ev.target,
			items: [ ...remaining ]
		});
	}

	// Called to update permissions
	function update() {

		// Update the permissions
		brain.update('permissions', {
			user: value._id,
			portal: tabs[tab as number],
			rights: permissions[tabs[tab as number]]
		}).then((data: boolean) => {
			if(data) {
				if(onUpdate) {
					onUpdate();
				}
				onClose();
			}
		});
	}

	// Render
	return (
		<React.Fragment>
			<Tabs
				onChange={(ev: React.SyntheticEvent, i: number) => {
					if(i !== Object.keys(permissions).length) {
						tabSet(i);
					}
				}}
				scrollButtons="auto"
				value={tab}
				variant="scrollable"
			>
				{omap(permissions, ((o, p) =>
					<Tab key={p} label={portals[p].title} />
				))}
				{!empty(remaining) &&
					<Tab icon={<i className="fa-solid fa-plus" />} onClick={portalAddMenu} />
				}
			</Tabs>
			{portalMenu !== false &&
				<Menu
					anchorEl={portalMenu.element}
					open={true}
					onClose={() => portalMenuSet(false)}
				>
					{portalMenu.items.map(s =>
						<MenuItem key={s} onClick={() => {
							portalMenuSet(false);
							portalAdd(s);
						}}>
							{portals[s].title}
						</MenuItem>
					)}
				</Menu>
			}
			{tab !== false && portals[tabs[tab]].permissions.map(section =>
				<Paper key={section.title} className="permissions">
					<Grid container spacing={0}>
						<Grid item xs={12} md={6} className="group_title">{section.title}</Grid>
						<Grid item xs={2} md={1} className="right_title">All</Grid>
						<Grid item xs={2} md={1} className="right_title">Create</Grid>
						<Grid item xs={2} md={1} className="right_title">Read</Grid>
						<Grid item xs={2} md={1} className="right_title">Update</Grid>
						<Grid item xs={2} md={1} className="right_title">Delete</Grid>
						{section.rights.map(perm =>
							<Permission
								allowed={perm.allowed}
								key={perm.name}
								labels={labelsRef.current}
								name={perm.name}
								onChange={change}
								title={perm.title}
								value={(permissions &&
									permissions[tabs[tab]] &&
									permissions[tabs[tab]][perm.name]
								) || {}}
							/>
						)}
						<Grid item xs={2} md={1}>&nbsp;</Grid>
					</Grid>
				</Paper>
			)}
			<Box className="actions">
				<Button variant="contained" color="secondary" onClick={onClose}>Cancel</Button>
				<Button variant="contained" color="primary" onClick={update}>Update</Button>
			</Box>
		</React.Fragment>
	);
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
}