/**
 * Verification
 *
 * Verification page
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @created 2023-01-17
 */
/// <reference types="react" />
import PropTypes from 'prop-types';
export type VerificationProps = {
    mobile: boolean;
    onSuccess: () => void;
    verificationKey: string;
};
/**
 * Verification
 *
 * Handles verifying the email and reporting success/failure
 *
 * @name Verification
 * @access public
 * @param Object props Properties passed to the component
 * @returns React.Component
 */
declare function Verification(props: VerificationProps): JSX.Element;
declare namespace Verification {
    var propTypes: {
        mobile: PropTypes.Validator<boolean>;
        onSuccess: PropTypes.Requireable<(...args: any[]) => any>;
        verificationKey: PropTypes.Validator<string>;
    };
}
export default Verification;
