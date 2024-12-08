/**
 * ID Add
 *
 * Handles adding a set of rights for a single ID on a single permission
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-07-30
 */
import PropTypes from 'prop-types';
import React from 'react';
export type IdAddProps = {
    allowed: number;
    labels: Record<string, string>;
    onSave: (id: string, right: number) => void;
};
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
declare function IdAdd(props: IdAddProps): React.JSX.Element;
declare namespace IdAdd {
    var propTypes: {
        allowed: PropTypes.Validator<number>;
        labels: PropTypes.Validator<{
            [x: string]: string | null | undefined;
        }>;
        onSave: PropTypes.Validator<(...args: any[]) => any>;
    };
}
export default IdAdd;
