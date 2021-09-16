# API documentation

This API supports:

-   Registering and logging in user.
-   Issuing and verifying JWTs.
-   Adding collections, posts and comments.

**Base API URL: http://localhost:{PORT}** \
It has following routes:

-   Users Route
-   Collections Route
-   Search Route

## Users Route

**/users/register** (POST)\
Requires an object with valid username, password and email fields. \
Return response with success field and msg indicating result and userid, username and email. \
**/users/login** (POST)\
Requires username and password and return JWT if successful. \
**/users/profiles/:userName** (GET)\
Returns object containing user information corresponding to userName and their posts. \
**/users/myPosts** (GET)\
Requires JWT in authorization header and return posts of user corresponding to JWT.
**/users/recents** (GET)\
Requires JWT in authorization header and return recent posts made across the website.

## Collections Route

**/collections/new** (POST)\
Requires name and description and JWT in authorization header. Creates new collection with user in JWT as owner.
**/collections/:collectionName/post/new** (POST)\
Creates new post in collectionName.
**/collections/:collectionName/post/:postId/comment/new** (POST)\
Creates new comment in collectionName under postId.
**/collections/:collectionName/join** (GET)\
Add the user in JWT to collectionName allowing user to post and comment in that collection.
**/collections/:collectionName/leave** (GET)\
Removes the user from collection.
**/collections/:collectionName/post/:postId/show** (GET)\
Return postId data along with its comments as object.
**/collections/:collectionName/show** (GET)\
Return collectionName data along with its posts as object.

## Search Route

**/search/:searchQuery** (GET)\
Checks if user is authenticated to make request using JWT and accordingly sends 4 users, posts and collections closest to search query.
