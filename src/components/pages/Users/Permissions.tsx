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

// Types
export type PermissionsProps = {
	onClose: () => void,
	onUpdate?: (message: string) => void,
	sections: SectionStruct[],
	value: Record<string, number>
}
export type PermissionsRecord = {
	_user: string,
	_created?: number,
	_updated?: number,
	rights: Record<string, number>
}
export type PermissionStruct = {
	name: string,
	title: string,
	allowed: number
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
	const [permissions, permissionsSet] = useState<PermissionsRecord | false>(false);

	// Load effect
	useEffect(() => {
		brain.read('permissions', {
			_id: props.value._id
		}).then(permissionsSet);
	}, [props.value]);

	// Called when any permission is changed
	function change(name: string, val: number) {

		// Clone the current values
		const dPermissions = clone(permissions);

		// If we don't have the name yet
		if(!dPermissions.rights[name]) {
			dPermissions.rights[name] = 0;
		}

		// Set the rights
		if(val) {
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
			_id: props.value._id,
			rights: (permissions as PermissionsRecord).rights
		}).then((data: boolean) => {
			if(data) {
				if(props.onUpdate) {
					props.onUpdate('Permissions');
				} else {
					props.onClose();
				}
			}
		});
	}

	// Render
	return (
		<React.Fragment>
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
								value={(permissions && permissions.rights[perm.name]) || 0}
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
	onUpdated: PropTypes.func,
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