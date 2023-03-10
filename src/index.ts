// Manage signed in user
export * as Myself from './Myself';

// Pages
export { default as ForgotPage } from './components/pages/Forgot';
export type { ForgotProps as ForgotPageProps } from './components/pages/Forgot';
export { default as SetupPage } from './components/pages/Setup';
export type { SetupProps as SetupPageProps } from './components/pages/Setup';
export { default as UsersPage } from './components/pages/Users';
export type { UsersProps as UsersPageProps } from './components/pages/Users';
export { default as VerificationPage } from './components/pages/Verification';
export type { VerificationProps as VerificationPageProps } from './components/pages/Verification';

// Dialogs
export { default as AccountDialog } from './components/dialogs/Account';
export type { AccountProps as AccountDialogProps } from './components/dialogs/Account';
export { default as SignInDialog } from './components/dialogs/SignIn';
export type { SignInProps as SignInDialogProps } from './components/dialogs/SignIn';

// Permission rights constants
export const RIGHTS = {
	CREATE: 1,
	READ: 2,
	UPDATE: 4,
	DELETE: 8,
	ALL: 15
};

// Rights by permission
export type rightsStruct = {
	create?: true,
	delete?: true,
	read?: true,
	update?: true
}