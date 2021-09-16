# Readit App

This is an app based on reddit. It uses React.js for frontend and nodejs + express for backend. Authentication is done using jsonwentokens. \
It supports the following functionality:

- Registering user.
- Logging in user and receiving JWT for future authentication.
- Creating collections (like subreddits).
- Adding posts in collections.
- Adding comments to posts.
- Joining and leaving collections.

# How to use this github repository

To run the app: \

1. run `npm install` in both backend and frontend directories.
2. Run `node generateKeyPair.js` inside keys folder in backend to generate public and private key for signing JWTs.
3. Create .env file in backend directory and add variables PORT (port on which to start express server) and DB_URL (url to mongodb server)
4. `node server.js` inside backend to start server.
5. `npm start` inside frontend to start react app.

# Notes

- For documentation on the backend server please see readme inside backend directory.
- **Frontend in progress not yet complete.**
