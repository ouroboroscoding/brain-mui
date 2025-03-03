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
import React, { useRef, useState } from 'react';
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
export default function IdAdd(props) {
    // State
    const [id, idSet] = useState(Object.keys(props.labels)[0]);
    const [other, otherSet] = useState('');
    const [rights, rightsSet] = useState(0);
    // Refs
    const key = useRef(uuidv4());
    // Called when all is switched on/off
    function allChange(event, checked) {
        rightsSet(checked ? props.allowed : 0);
    }
    // Called when any individual right is changed
    function bitChange(bit) {
        rightsSet(v => v ^ bit);
    }
    // Called to send the new ID to the parent
    function save() {
        props.onSave(id === '-1' ? other : id, rights);
    }
    // Render
    return (React.createElement(React.Fragment, null,
        React.createElement(Grid, { item: true, xs: 12, md: 6, className: "name field" },
            React.createElement(FormControl, { className: `node_select`, size: "small", variant: "outlined" },
                React.createElement(InputLabel, { id: key.current }, "ID"),
                React.createElement(Select, { label: "ID", labelId: key.current, native: true, onChange: ev => idSet(ev.target.value), size: "small", value: id },
                    omap(props.labels, (v, k) => React.createElement("option", { key: k, value: k }, v)),
                    React.createElement("option", { value: "-1" }, "other"))),
            id === '-1' &&
                React.createElement(TextField, { inputProps: {
                        pattern: "^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}$"
                    }, label: "ID", onChange: ev => otherSet(ev.target.value), placeholder: "ID", size: "small", value: other, variant: "outlined" })),
        React.createElement(Grid, { item: true, xs: 2, md: 1, className: "right_check" },
            React.createElement(Switch, { checked: rights === props.allowed ? true : false, onChange: allChange, color: "primary", inputProps: {
                    "aria-label": 'all checkbox'
                } })),
        [RIGHTS.CREATE, RIGHTS.READ, RIGHTS.UPDATE, RIGHTS.DELETE].map(bit => React.createElement(Grid, { key: bit, item: true, xs: 2, md: 1, className: "right_check" }, props.allowed & bit ?
            React.createElement(Switch, { checked: rights & bit ? true : false, onChange: ev => bitChange(bit), color: "primary", inputProps: {
                    "aria-label": 'rights checkbox'
                } })
            :
                '')),
        React.createElement(Grid, { item: true, xs: 2, md: 1, className: "right_check" },
            React.createElement(Tooltip, { title: "Drop ID" },
                React.createElement(IconButton, { onClick: save },
                    React.createElement("i", { className: "fa-solid fa-floppy-disk blue" }))))));
}
// Force props
IdAdd.propTypes = {
    allowed: PropTypes.number.isRequired,
    labels: PropTypes.objectOf(PropTypes.string).isRequired,
    onSave: PropTypes.func.isRequired
};
