/**
 * ID Edit
 *
 * Handles a set of existing rights for a single ID on a single permission
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-07-30
 */

// Ouroboros modules
import { RIGHTS } from '@ouroboros/brain';

// NPM modules
import PropTypes from 'prop-types';
import React, { ChangeEvent, useState } from 'react';

// Material UI
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';

// Types
export type IdEditProps = {
	allowed: number,
	ident: string,
	labels: Record<string, string>,
	onChange: (id: string, right: number) => void,
	onDrop: (id: string) => void,
	value: number
}

/**
 * ID Edit
 *
 * Handles a single existing permission record
 *
 * @name IdEdit
 * @access public
 * @param props Properties passed to the component
 * @returns React.Component
 */
export default function IdEdit(props: IdEditProps) {

	// Called when all is switched on/off
	function allChange(event: ChangeEvent<HTMLInputElement>, checked: boolean) {
		props.onChange(props.ident, checked ? props.allowed : 0);
	}

	// Called when any individual right is changed
	function bitChange(bit: number) {
		props.onChange(props.ident, props.value ^ bit);
	}

	// Called when the user wants to drop the whole ID
	function drop() {
		props.onDrop(props.ident);
	}

	// Render
	return (
		<React.Fragment>
			<Grid item xs={12} md={6} className="name">
				{props.ident in props.labels ? props.labels[props.ident] : props.ident}
			</Grid>
			<Grid item xs={2} md={1} className="right_check">
				<Switch
					checked={props.value === props.allowed ? true : false}
					onChange={allChange}
					color="primary"
					inputProps={{
						"aria-label": 'all checkbox'
					}}
				/>
			</Grid>
			{[RIGHTS.CREATE, RIGHTS.READ, RIGHTS.UPDATE, RIGHTS.DELETE].map(bit =>
				<Grid key={bit} item xs={2} md={1} className="right_check">
					{props.allowed & bit ?
						<Switch
							checked={props.value & bit ? true : false}
							onChange={ev => bitChange(bit)}
							color="primary"
							inputProps={{
								"aria-label": 'rights checkbox'
							}}
						/>
					:
						''
					}
				</Grid>
			)}
			<Grid item xs={2} md={1} className="right_check">
				<Tooltip title="Drop ID">
					<IconButton onClick={drop}>
						<i className="fa-solid fa-trash red" />
					</IconButton>
				</Tooltip>
			</Grid>
		</React.Fragment>
	);
}

// Force props
IdEdit.propTypes = {
	allowed: PropTypes.number.isRequired,
	ident: PropTypes.string.isRequired,
	labels: PropTypes.objectOf(PropTypes.string).isRequired,
	onChange: PropTypes.func.isRequired,
	onDrop: PropTypes.func.isRequired,
	value: PropTypes.number.isRequired
}