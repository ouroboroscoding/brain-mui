# @ouroboros/brain-mui releases

## 2.3.4
- Fixed a bug that caused a crash when adding a new portal to a user's permissions.

## 2.3.3
- Removed the `mobile` prop from all components as it wasn't used at all.
- Fixed a bug in `UserCreate` where the `onSuccess` prop was called twice.

## 2.3.2
- Fixed bug where an instance of `Tree` was called without a `__name__`.

## 2.3.1
- Updated code still trying to fetch from `@ouroboros/brain/definitions` instead of `@ouroboros/brain/define`.

## 2.3.0
- Updated `@ouroboros/brain` to 2.3.0
- Updated `@ouroboros/brain-react` to 2.3.0
- Updated `@ouroboros/define` to 1.1.3
- Updated `@ouroboros/define-mui` to 1.5.6
- Updated `@ouroboros/tools` to 0.7.0
- Combined the `Users` props `allowedPermissions` and `portals` into just `portals` with a different structure.
