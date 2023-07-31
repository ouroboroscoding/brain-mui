/**
 * ID Edit
 *
 * Handles a set of existing rights for a single ID on a single permission
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-07-30
 */
/// <reference types="react" />
import PropTypes from 'prop-types';
export type IdEditProps = {
    allowed: number;
    ident: string;
    labels: Record<string, string>;
    onChange: (id: string, right: number) => void;
    onDrop: (id: string) => void;
    value: number;
};
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
declare function IdEdit(props: IdEditProps): JSX.Element;
declare namespace IdEdit {
    var propTypes: {
        allowed: PropTypes.Validator<number>;
        ident: PropTypes.Validator<string>;
        labels: PropTypes.Validator<{
            [x: string]: string | null | undefined;
        }>;
        onChange: PropTypes.Validator<(...args: any[]) => any>;
        onDrop: PropTypes.Validator<(...args: any[]) => any>;
        value: PropTypes.Validator<number>;
    };
}
export default IdEdit;
