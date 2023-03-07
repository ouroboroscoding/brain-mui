/**
 * Forgot
 *
 * Forgot page
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @created 2023-01-17
 */
/// <reference types="react" />
import PropTypes from 'prop-types';
export type ForgotProps = {
    mobile: boolean;
    onSuccess?: () => void;
    forgotKey: string;
};
/**
 * Forgot
 *
 * Handles forgotten password / reset dialog
 *
 * @name Forgot
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
declare function Forgot(props: ForgotProps): JSX.Element;
declare namespace Forgot {
    var propTypes: {
        mobile: PropTypes.Validator<boolean>;
        onSuccess: PropTypes.Requireable<(...args: any[]) => any>;
        forgotKey: PropTypes.Validator<string>;
    };
}
export default Forgot;
