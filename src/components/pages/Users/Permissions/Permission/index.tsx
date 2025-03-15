/**
 * Permission
 *
 * Handles a set of rights for a single permission
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-03-06
 */

// Ouroboros modules
import { omap, owithout } from '@ouroboros/tools';

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

// Types
export type PermissionProps = {
	allowed: number,
	labels: Record<string, string>,
	onChange: (name: string, rights: Record<string, number>) => void,
	name: string,
	title: string,
	value: Record<string, number>
}

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
export default function Permission(props: PermissionProps) {

	// State
	const [ add, addSet ] = useState<boolean>(false);

	// Called when a new ID is to be added
	function idAdded(id: string, rights: number) {

		// If the rights are empty, do nothing
		if(rights === 0) {
			return;
		}

		// Clone the current rights
		const oRights = { ...props.value };

		// Add the record
		oRights[id] = rights;

		// Let the parent know
		props.onChange(props.name, oRights);

		// Clear the form
		addSet(false);
	}

	// Called when any rights are changed
	function idChanged(id: string, rights: number) {

		// Let the parent know
		props.onChange(props.name, { ...props.value, [id]: rights });
	}

	// Called to drop a right completely
	function idDropped(id: string) {

		// If the ID exists
		if(id in props.value) {

			// Let the parent know
			props.onChange(props.name, owithout(props.value, id));
		}
	}

	// Render
	return (
		<React.Fragment>
			<Grid item xs={10} className="name">{props.title}</Grid>
			<Grid item xs={2} className="right_title">
				<Tooltip title="Add ID">
					<IconButton onClick={() => addSet(b => !b)}>
						<i className={'fa-solid fa-plus' + (add ? ' open' : '')} />
					</IconButton>
				</Tooltip>
			</Grid>
			{omap(props.value, (v, k, i) =>
				<IdEdit
					allowed={props.allowed}
					ident={k}
					key={k}
					labels={props.labels}
					onChange={idChanged}
					onDrop={idDropped}
					value={v}
				/>
			)}
			{add &&
				<IdAdd
					allowed={props.allowed}
					labels={props.labels}
					onSave={idAdded}
				/>
			}
		</React.Fragment>
	);
}

// Force props
Permission.propTypes = {
	allowed: PropTypes.number.isRequired,
	labels: PropTypes.objectOf(PropTypes.string).isRequired,
	onChange: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	value: PropTypes.objectOf(PropTypes.number).isRequired
}