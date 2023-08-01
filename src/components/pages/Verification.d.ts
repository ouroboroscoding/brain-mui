/**
 * Verification
 *
 * Verification page
 *
 * @author Chris Nasr <chris@ouroboroscoding.com>
 * @created 2023-01-17
 */
import PropTypes from 'prop-types';
import React from 'react';
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
declare function Verification(props: VerificationProps): React.JSX.Element;
declare namespace Verification {
    var propTypes: {
        mobile: PropTypes.Validator<boolean>;
        onSuccess: PropTypes.Requireable<(...args: any[]) => any>;
        verificationKey: PropTypes.Validator<string>;
    };
}
export default Verification;
