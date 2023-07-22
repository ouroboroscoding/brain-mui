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
import { afindi, arrayFindDelete } from '@ouroboros/tools';

// NPM modules
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

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
	onClose: () => void,
	onUpdate?: () => void,
	portals: PortalStruct[],
	sections: SectionStruct[],
	value: Record<string, number>
}
export type PermissionsRecord = {
	_created?: number,
	_updated?: number,
	user: string,
	portal: string,
	title: string,
	rights: Record<string, number>
}
export type PermissionStruct = {
	name: string,
	title: string,
	allowed: number
}
export type PortalStruct = {
	key: string | null,
	title: string
}
type portalMenuStruct = {
	element: any,
	items: PortalStruct[]
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
export default function Permissions(props: PermissionsProps) {

	// State
	const [permissions, permissionsSet] = useState<PermissionsRecord[]>([]);
	const [tab, tabSet] = useState<number>(0);
	const [portalMenu, portalMenuSet] = useState<portalMenuStruct | false>(false);
	const [remaining, remainingSet] = useState<PortalStruct[]>([]);

	// Load effect
	useEffect(() => {
		brain.read('permissions', {
			user: props.value._id
		}).then(data => {
			for(const o of data) {
				const i = afindi(props.portals, 'key', o.portal);
				o.title = i > -1 ? props.portals[i].title : 'UNKNOWN';
			}
			permissionsSet(data);
		});
	}, [props.value]);

	// Remaining effect
	useEffect(() => {

		// Copy the possible portals
		const lPortals: PortalStruct[] = clone(props.portals);

		// Go through each passed permission
		for(const o of permissions) {

			// Remove it from the remaining
			arrayFindDelete(lPortals, 'key', o.portal);
		}

		// Store the new remaining
		remainingSet(lPortals);

	}, [props.portals, permissions])

	// Called when any permission is changed
	function change(name: string, val: number) {

		// Clone the current values
		const dPermissions = clone(permissions);

		// If we don't have the name yet
		if(!dPermissions[tab].rights[name]) {
			dPermissions[tab].rights[name] = 0;
		}

		// Set the rights
		if(val) {
			dPermissions[tab].rights[name] = val;
		}

		// Else, remove the permission
		else {
			delete dPermissions[tab].rights[name];
		}

		// Update the state
		permissionsSet(dPermissions);
	}

	// Called to add a portal to the permissions
	function portalAdd(portal: PortalStruct) {

		// Add the portal to the data
		permissionsSet((val: PermissionsRecord[]) => {
			const lPerms = clone(val);
			lPerms.push({
				portal: portal.key,
				rights: {},
				title: portal.title
			});
			return lPerms;
		});

		// Remove the portal from the remaining
		remainingSet((val: PortalStruct[]) => {
			return (
				arrayFindDelete(val, 'key', portal.key, true) as PortalStruct[]
			);
		});

		// Set the new tab
		tabSet(remaining.length);
	}

	// Called to display the menu to add a location to the order
	function portalAddMenu(ev: React.MouseEvent<HTMLElement>) {

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
		}).then((data: boolean) => {
			if(data) {
				if(props.onUpdate) {
					props.onUpdate();
				}
				props.onClose();
			}
		});
	}

	// Render
	return (
		<React.Fragment>
			<Tabs
				onChange={(ev: React.SyntheticEvent, portal: number) => {
					if(portal !== permissions.length) {
						tabSet(portal);
					}
				}}
				scrollButtons="auto"
				value={tab}
				variant="scrollable"
			>
				{permissions.map(o =>
					<Tab key={o.portal} label={o.title} />
				)}
				{remaining.length > 0 &&
					<Tab icon={<i className="fa-solid fa-plus" />} onClick={portalAddMenu} />
				}
			</Tabs>
			{portalMenu !== false &&
				<Menu
					anchorEl={portalMenu.element}
					open={true}
					onClose={() => portalMenuSet(false)}
				>
					{portalMenu.items.map(o =>
						<MenuItem key={o.key} onClick={() => {
							portalMenuSet(false);
							portalAdd(o);
						}}>
							{o.title}
						</MenuItem>
					)}
				</Menu>
			}
			{props.sections.map(section =>
				<Paper key={section.title} className="permissions">
					<Grid container spacing={2}>
						<Grid item md={2} xs={7} className="group_title">{section.title}</Grid>
						<Grid item md={2} xs={1} className="right_title">All</Grid>
						<Grid item md={2} xs={1} className="right_title">Create</Grid>
						<Grid item md={2} xs={1} className="right_title">Read</Grid>
						<Grid item md={2} xs={1} className="right_title">Update</Grid>
						<Grid item md={2} xs={1} className="right_title">Delete</Grid>
						{section.rights.map(perm =>
							<Permission
								allowed={perm.allowed}
								key={perm.name}
								name={perm.name}
								onChange={change}
								title={perm.title}
								value={(permissions && permissions[tab] && permissions[tab].rights[perm.name]) || 0}
							/>
						)}
					</Grid>
				</Paper>
			)}
			<Box className="actions">
				<Button variant="contained" color="secondary" onClick={props.onClose}>Cancel</Button>
				<Button variant="contained" color="primary" onClick={update}>Update</Button>
			</Box>
		</React.Fragment>
	);
}

// Force props
Permissions.propTypes = {
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
}