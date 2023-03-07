/**
 * Permission
 *
 * Handles a set of rights for a single permission
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-03-06
 */

// NPM modules
import PropTypes from 'prop-types';
import React, { ChangeEvent } from 'react';

// Material UI
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';

// Types
import { RIGHTS } from '../../../';
export type PermissionProps = {
	allowed: number,
	onChange: (name: string, checked: number) => void,
	name: string,
	title: string,
	value: number
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

	// Called when all is switched on/off
	function allChange(event: ChangeEvent<HTMLInputElement>, checked: boolean) {

		// If it's on, set it to all allowed, else 0
		props.onChange(props.name, checked ? props.allowed : 0);
	}

	// Called when any individual right is changed
	function rightChange(bit: number) {

		// Combine it with the current rights and let the parent know
		props.onChange(props.name, props.value ^ bit);
	}

	// Render
	return (
		<React.Fragment>
			<Grid item md={2} xs={7} className="name">{props.title}</Grid>
			<Grid item md={2} xs={1} className="right_check">
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
				<Grid key={bit} item md={2} xs={1} className="right_check">
					{props.allowed & bit ?
						<Switch
							checked={props.value & bit ? true : false}
							onChange={ev => rightChange(bit)}
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
		</React.Fragment>
	);
}

// Force props
Permission.propTypes = {
	allowed: PropTypes.number.isRequired,
	onChange: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	value: PropTypes.number.isRequired
}