/**
 * Sign In
 *
 * Handles sign in modal
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @copyright Ouroboros Coding Inc.
 * @created 2023-01-17
 */
/// <reference types="react" />
import { responseErrorStruct } from '@ouroboros/body';
import PropTypes from 'prop-types';
import { signinReturn } from '../../Myself';
export type SignInProps = {
    forgotUrl: string;
    onError?: (error: responseErrorStruct) => void;
    onForgot?: () => void;
    onSignIn?: (data: signinReturn) => void;
};
/**
 * Sign In
 *
 * Displays the form to sign into the site
 *
 * @name SignIn
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
declare function SignIn(props: SignInProps): JSX.Element | null;
declare namespace SignIn {
    var propTypes: {
        forgotUrl: PropTypes.Validator<string>;
        onError: PropTypes.Requireable<(...args: any[]) => any>;
        onForgot: PropTypes.Requireable<(...args: any[]) => any>;
        onSignIn: PropTypes.Requireable<(...args: any[]) => any>;
    };
}
export default SignIn;
