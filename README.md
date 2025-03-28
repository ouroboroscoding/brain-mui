# @ouroboros/brain-mui
[![npm version](https://img.shields.io/npm/v/@ouroboros/brain-mui.svg)](https://www.npmjs.com/package/@ouroboros/brain-mui) ![Custom License](https://img.shields.io/npm/l/@ouroboros/brain-mui.svg)

Material-UI Components for interacting with the
[brain2_oc](https://pypi.org/project/brain2_oc/) service. It uses
[@ouroboros/brain](https://npmjs.com/package/@ouroboros/brain) and
[@ouroboros/brain-react](https://npmjs.com/package/@ouroboros/brain-react) to
handle the actual connections.

See [Releases](https://github.com/ouroboroscoding/brain-mui/blob/main/releases.md)
for changes from release to release.

## Installation
```console
foo@bar:~$ npm install @ouroboros/brain-mui
```

## Using brain-mui
If you're using react with material-ui, this library provides components for
searching and creating users, assigning permissions to different portals, and
for the forgot password, setup, and email verification landing pages. It also
provides sign in and account details dialogs.

### Components
- [AccountDialog](#accountdialog)
- [ForgotPage](#forgotpage)
- [SetupPage](#setuppage)
- [SignInDialog](#signindialog)
- [UserCreate](#usercreate)
- [UserSearch](#usersearch)
- [UsersPage](#userspage)
- [VerificationPage](#verificationpage)
- [TypeScript](#typescript)

### AccountDialog
`AccountDialog` contains three forms allowing the currently signed in user to
change password, change email, and change other details. It uses
[MUI Dialog](https://mui.com/material-ui/react-dialog/) to show the forms.

```jsx
import { AccountDialog } from '@ouroboros/brain-mui';
import React, { useState } from 'react';
import { addError, addMessage } from 'your_module';
function MyComponent(props) {
  const [ acc, setAcc ] = useState(false);
  return <div>
    <button onClick={() => setAcc(true)}>My Account</button>
    {acc &&
      <AccountDialog
        onClose={() => setAcc(false)}
        onDetailsChanged={user => addMessage('Details changed!')}
        onEmailChanged={email => addMessage('E-Mail Address changed!')}
        onError={addError}
        onPasswdChanged={() => addMessage('Password changed!')}
        verificationUrl="https://mydomain.com/verify/{key}"
      />
    }
  </div>;
}
```

| Prop | Type | Optional | Description |
| ---- | ---- | -------- | ----------- |
| onClose | <nobr>`() => void`</nobr> | no | Callback for when the dialog is closed. |
| onDetailsChanged | <nobr>`user => void`</nobr> | yes | Callback for when the user changes their details. `user` is an object with just the fields that changed. |
| onEmailChanged | <nobr>`email => void`</nobr> | yes | Callback for when the user changes their email. `email` is a string. |
| onError | <nobr>`error => void`</nobr> | yes | Callback for when an error occurs. `error` is a `responseErrorStruct` from [@ouroboros/body](https://www.npmjs.com/package/@ouroboros/body). |
| onPasswdChanged | <nobr>`() => void`</nobr> | yes | Callback for when the user changes their password. |
| verificationUrl | string | no | The URL to send by email for the user to verify their e-mail address. Must contain the string "{key}" as a placeholder for the actual key. |

[ [components](#components) ]

### ForgotPage
`ForgotPage` is used in handling a request for a password change via a keyed
url.

```jsx
import { ForgotPage } from '@ouroboros/brain-mui';
import React from 'react';
import { useParams } from 'react-router-dom';
import { addMessage } from 'your_module';
function MyForgotPage(props) {
  const { key } = useParams();
  return <ForgotPage
    forgotKey={key}
    onSuccess={() => addMessage('Password reset!')}
  />
}
```

| Prop | Type | Optional | Description |
| ---- | ---- | -------- | ----------- |
| forgotKey | string | no | The forgot password key sent by email to verify the user and allow them to reset their password. |
| onSuccess | <nobr>`() => void` | yes | Callback for when the user successfully sets a new password. |

[ [components](#components) ]

### SetupPage
`SetupPage` is used in handling a request to continue setting up a new account
via a keyed url.

```jsx
import { SetupPage } from '@ouroboros/brain-mui';
import React from 'react';
import { useParams } from 'react-router-dom';
import { addMessage } from 'your_module';
function MySetupPage(props) {
  const { key } = useParams();
  return <SetupPage
    setupKey={key}
    onSuccess={() => addMessage('Setup complete!')}
  />
}
```

| Prop | Type | Optional | Description |
| ---- | ---- | -------- | ----------- |
| setupKey | string | no | The setup key sent by email to verify the user and allow them to set a password and update any details to complete their account setup. |
| onSuccess | <nobr>`() => void` | yes | Callback for when the user successfully finishes setting up their account. |

[ [components](#components) ]

### SignInDialog
`SignInDialog` shows a form with email and password for the user to sign in. It
defaults to the "" (empty string) portal, which is generally used as the admin
portal. It uses [MUI Dialog](https://mui.com/material-ui/react-dialog/) to show
the form.

`SignInDialog` uses `signup` from
[@ouroboros/brain-react](https://www.npmjs.com/package/@ouroboros/brain-react)
which allows you to use the `useUser` hook, as well as the other hooks provided
by `brain-react`.

```jsx
import { SignInDialog } from '@ouroboros/brain-mui';
import { useUser } from '@ouroboros/brain-react';
import React from 'react';
import { addError, addMessage } from 'your_module';
function MyApp(props) {
  const user = useUser();
  return (
    <div>
      <h1>MyDomain</h1>
      {user === false ?
        <SignInDialog
          forgotUrl="https://mydomain.com/forgot/{key}"
          onError={addError}
          onForgot={() => {
            addMessage('Your forgot password request has been sent!');
          }}
          onSignIn={signin => {
            localStorage.setItem('session', signin.session);
            addMessage(`Welcome ${signin.user.first_name}!`);
          }}
        /> :
        <div>Members only content.</div>
      }
    <div>
  );
}
```

| Prop | Type | Optional | Description |
| ---- | ---- | -------- | ----------- |
| forgotUrl | string | no | The URL to send by email for a user who forgot their password. Must contain the string "{key}" as a placeholder for the actual key. |
| onError | <nobr>`error => void`</nobr> | yes | Callback for when an error occurs. `error` is a `responseErrorStruct` from [@ouroboros/body](https://www.npmjs.com/package/@ouroboros/body). |
| onForgot | <nobr>`() => void`</nobr> | yes | Callback for when the use has initiated the forgot password process. |
| onSignIn | <nobr>`signin => void`</nobr> | yes | Callback for when the user successfully signs in. `signin` is a `signinReturn` from [@ouroboros/brain-react](https://www.npmjs.com/package/@ouroboros/brain-react). |

[ [components](#components) ]

### UserCreate
`UserCreate` is a stand alone component which provides a form to create a new
user in the system. It's loaded by [UsersPage](#userspage), but you could also
load it to provide this functionality anywhere.

```jsx
import { UserCreate } from '@ouroboros/brain-mui';
import React, { useState } from 'react';
import { addError, addMessage } from 'your_module';
function MyComponent(props) {
  const [ create, setCreate ] = useState(false);
  const [ records, setRecords ] = useState([ /* user records */ ]);
  return <div>
    <button onClick={() => setCreate(true)}>Add User</button>
    {create &&
      <UserCreate
        onError={addError}
        onCancel={() => setCreate(false)}
        onSuccess={user => {
          addMessage('New user created!');
          setRecords(l => [ ...l, user ])
        }}
        setupUrl="https://mydomain.com/setup/{key}"
      />
    }
    {records.map(o =>
      /* do something with record */
    )}
  <div>
}
```

| Prop | Type | Optional | Description |
| ---- | ---- | -------- | ----------- |
| onError | <nobr>`error => void`</nobr> | yes | Callback for when an error occurs. `error` is a `responseErrorStruct` from [@ouroboros/body](https://www.npmjs.com/package/@ouroboros/body). |
| onCancel | <nobr>`() => void`</nobr> | yes | Callback for when the user clicks the cancel button. |
| onSuccess | <nobr>`user => void`</nobr> | yes | Callback for when a new `user` is created. |
| setupUrl | string | no | The URL to send by email to the new user for them to complete the setup for their account. Must contain the string "{key}" as a placeholder for the actual key. |

[ [components](#components) ]

### UserSearch
`UserSearch` is a stand alone component which provides a form to search for
existing users in the system. It's loaded by [UsersPage](#userspage), but you
could also load it to provide this functionality anywhere.

```jsx
import { UserSearch } from '@ouroboros/brain-mui';
import React, { useState } from 'react';
import { addError } from 'your_module';
function MyComponent(props) {
  const [ records, setRecords ] = useState(false);
  return <div>
    <UserSearch
      onError={addError}
      onSuccess={setRecords}
    />
    {records && records.length && records.map(o =>
      /* do something with record */
    )}
  <div>
}
```

| Prop | Type | Optional | Description |
| ---- | ---- | -------- | ----------- |
| onError | <nobr>`error => void`</nobr> | yes | Callback for when an error occurs. `error` is a `responseErrorStruct` from [@ouroboros/body](https://www.npmjs.com/package/@ouroboros/body). |
| onSuccess | <nobr>`records => void`</nobr> | yes | Callback for after the search is run. `records` is an array of `user` objects. |

[ [components](#components) ]

### UsersPage
`UsersPage` is an all in one page to create new users, search existing users,
and then from the result, edit the user's details, change their password, and
manage their permissions.

```jsx
import { UsersPage } from '@ouroboros/brain-mui';
import { RIGHTS } from '@ouroboros/brain';
import React from 'react';
import { useParams } from 'react-router-dom';
import { addError, addMessage } from 'your_module';
const portals = {
  '': {
    title: 'Admin',
    permissions: [ {
      title: 'Authorization',
      rights: [ {
        name: 'brain_user',
        title: 'Users',
        allowed: RIGHTS.CREATE | RIGHTS.READ | RIGHTS.UPDATE
      }, {
        name: 'brain_permission',
        title: 'Permissions',
        allowed: RIGHTS.READ | RIGHTS.UPDATE
      } ]
    } ]
  },
  'my_app': {
    title: 'My App',
    permissions: [ {
      title: 'My Service Group',
      rights: [ {
        name: 'my_service_permission',
        title: 'My Service Permission',
        allowed: RIGHTS.ALL
      } ]
    }, {
      title: 'My Other Group',
      rights: [ {
        name: 'my_other_permission',
        title: 'My Other Permission',
        allowed: RIGHTS.READ
      } ]
    } ]
  }
}
function MyUsersPage(props) {
  const { key } = useParams();
  return <UsersPage
    onError={addError}
    onSuccess={(type, user) => {
	  /* type includes [
        'password', 'permissions', 'setup_sent',
        'setup_done', 'update'
      ] */
      addMessage(
        type === 'update' ?
          `Updated details for ${user._id}` :
          `${type} updated`
      )
    }}
    portals={portals}
  />
}
```

| Prop | Type | Optional | Description |
| ---- | ---- | -------- | ----------- |
| onError | <nobr>`error => void`</nobr> | yes | Callback for when an error occurs. `error` is a `responseErrorStruct` from [@ouroboros/body](https://www.npmjs.com/package/@ouroboros/body). |
| onSuccess | <nobr>`(type, user) => void`</nobr> | yes | Callback for when any of the following `type`s happen: 'password', 'permissions', 'setup_sent', 'setup_done', and 'update'. `user` is not set unless `type` is 'update', in which case it contains an object with data that has changed. |
| portals | object | yes | `portals` is an object with portal names for keys, and further objects with `title` and `permissions`, an array of sections to show in the UI for the portal. Each section consists of an object with `title` and `rights`, another array of objects with `name` (the actual permission string), `title` (what the user sees), and `allowed` ([RIGHTS](https://github.com/ouroboroscoding/brain-js/blob/main/README.md#rights)). |

[ [components](#components) ]

### VerificationPage
`VerificationPage` is used in handling a request to verify a user's new email,
after having changed it, via a keyed url.

```jsx
import { VerificationPage } from '@ouroboros/brain-mui';
import React from 'react';
import { useParams } from 'react-router-dom';
import { addMessage } from 'your_module';
function MyVerificationPage(props) {
  const { key } = useParams();
  return <VerificationPage
    onSuccess={() => addMessage('Setup complete!')}
    verificationKey={key}
  />
}
```

| Prop | Type | Optional | Description |
| ---- | ---- | -------- | ----------- |
| onSuccess | <nobr>`() => void` | yes | Callback for when the user successfully verifies their changed email address. |
| verificationKey | string | no | The verification key sent by email to verify the user. |

[ [components](#components) ]

### TypeScript
`ouroboros/brain-mui` exports the following types representing the `props` of
each of the above components.

```typescript
import type {
  AccountDialogProps,
  ForgotPageProps,
  SetupPageProps,
  SignInDialogProps,
  UserCreateProps,
  UserSearchProps,
  UsersPageProps,
  VerificationPageProps
} from '@ouroboros/brain-mui';
```

[ [components](#components) ]