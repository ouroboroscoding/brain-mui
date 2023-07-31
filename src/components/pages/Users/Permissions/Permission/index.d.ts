/**
 * Permission
 *
 * Handles a set of rights for a single permission
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-03-06
 */
/// <reference types="react" />
import PropTypes from 'prop-types';
export type PermissionProps = {
    allowed: number;
    labels: Record<string, string>;
    onChange: (name: string, rights: Record<string, number>) => void;
    name: string;
    title: string;
    value: Record<string, number>;
};
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
declare function Permission(props: PermissionProps): JSX.Element;
declare namespace Permission {
    var propTypes: {
        allowed: PropTypes.Validator<number>;
        labels: PropTypes.Validator<{
            [x: string]: string | null | undefined;
        }>;
        onChange: PropTypes.Validator<(...args: any[]) => any>;
        name: PropTypes.Validator<string>;
        title: PropTypes.Validator<string>;
        value: PropTypes.Validator<{
            [x: string]: number | null | undefined;
        }>;
    };
}
export default Permission;
