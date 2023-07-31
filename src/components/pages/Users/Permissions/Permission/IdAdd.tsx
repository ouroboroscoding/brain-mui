/**
 * ID Add
 *
 * Handles adding a set of rights for a single ID on a single permission
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-07-30
 */

// Ouroboros modules
import { RIGHTS } from '@ouroboros/brain';
import { omap } from '@ouroboros/tools';

// NPM modules
import PropTypes from 'prop-types';
import React, { ChangeEvent, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Material UI
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

// Types
export type IdAddProps = {
	allowed: number,
	labels: Record<string, string>,
	onSave: (id: string, right: number) => void
}

/**
 * ID Add
 *
 * Handles a single new permission record
 *
 * @name IdAdd
 * @access public
 * @param props Properties passed to the component
 * @returns React.Component
 */
export default function IdAdd(props: IdAddProps) {

	// State
	const [id, idSet] = useState<string>(Object.keys(props.labels)[0]);
	const [other, otherSet] = useState<string>('');
	const [rights, rightsSet] = useState<number>(0);

	// Refs
	const key = useRef(uuidv4());

	// Called when all is switched on/off
	function allChange(event: ChangeEvent<HTMLInputElement>, checked: boolean) {
		rightsSet(checked ? props.allowed : 0);
	}

	// Called when any individual right is changed
	function bitChange(bit: number) {
		rightsSet(v => v ^ bit);
	}

	// Called to send the new ID to the parent
	function save() {
		props.onSave(id === '-1' ? other : id, rights);
	}

	// Render
	return (
		<React.Fragment>
			<Grid item xs={12} md={6} className="name field">
				<FormControl className={`node_select`} size="small" variant="outlined">
					<InputLabel id={key.current}>ID</InputLabel>
					<Select
						label="ID"
						labelId={key.current}
						native
						onChange={ev => idSet(ev.target.value)}
						size="small"
						value={id}
					>
						{omap(props.labels, (v: string, k: string) =>
							<option key={k} value={k}>{v}</option>
						)}
						<option value="-1">other</option>
					</Select>
				</FormControl>
				{id === '-1' &&
					<TextField
						inputProps={{
							pattern: "^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}$"
						}}
						label="ID"
						onChange={ev => otherSet(ev.target.value)}
						placeholder="ID"
						size="small"
						value={other}
						variant="outlined"
					/>
				}
			</Grid>
			<Grid item xs={2} md={1} className="right_check">
				<Switch
					checked={rights === props.allowed ? true : false}
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
							checked={rights & bit ? true : false}
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
					<IconButton onClick={save}>
						<i className="fa-solid fa-floppy-disk blue" />
					</IconButton>
				</Tooltip>
			</Grid>
		</React.Fragment>
	);
}

// Force props
IdAdd.propTypes = {
	allowed: PropTypes.number.isRequired,
	labels: PropTypes.objectOf(PropTypes.string).isRequired,
	onSave: PropTypes.func.isRequired
}