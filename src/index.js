import * as Myself_1 from './Myself';
export { Myself_1 as Myself };
// Pages
export { default as ForgotPage } from './components/pages/Forgot';
export { default as SetupPage } from './components/pages/Setup';
export { default as UsersPage } from './components/pages/Users';
export { default as VerificationPage } from './components/pages/Verification';
// Dialogs
export { default as AccountDialog } from './components/dialogs/Account';
export { default as SignInDialog } from './components/dialogs/SignIn';
// Permission rights constants
export const RIGHTS = {
    CREATE: 1,
    READ: 2,
    UPDATE: 4,
    DELETE: 8,
    ALL: 15
};
