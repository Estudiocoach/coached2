# Security Specification

## Data Invariants
- A user can only read/write their own profile in `/users/{userId}`.
- A user can only read/write polls where they are the creator, or if they have the 'admin' role.
- Users can read/write their own responses.
- `users_allowed` is only accessible by admins.

## The "Dirty Dozen" Payloads (Examples)
1. User reads another user's profile: `get(/databases/(default)/documents/users/otherUser)` -> DENY
2. User writes another user's profile: `update(/databases/(default)/documents/users/otherUser)` -> DENY
3. User creates a poll with a different `creatorId`: `create(/databases/(default)/documents/polls/newPoll, {creatorId: 'otherUser'})` -> DENY
4. User writes to a poll they don't own: `update(/databases/(default)/documents/polls/otherPoll)` -> DENY
5. User reads `users_allowed` collection: `list(/databases/(default)/documents/users_allowed)` -> DENY
6. Admin updates another user's role: `update(/databases/(default)/documents/users/someUser, {role: 'admin'})` -> ALLOW (if admin)
7. User sets their own role to 'admin': `update(/databases/(default)/documents/users/ownUser, {role: 'admin'})` -> DENY
8. User injects a long string into `pollId`: `get(/databases/(default)/documents/polls/veryLongId...)` -> DENY
9. User updates `createdAt` of a poll: `update(/databases/(default)/documents/polls/somePoll, {createdAt: 123456})` -> DENY
10. Anonymous user reads polls: `list(/databases/(default)/documents/polls)` -> DENY
11. Admin writes to `users_allowed`: `create(/databases/(default)/documents/users_allowed/newEmail)` -> ALLOW (if admin)
12. User creates a response with invalid questionId: `create(/databases/(default)/documents/polls/poll1/responses/res1, {questionId: 'invalid'})` -> DENY
