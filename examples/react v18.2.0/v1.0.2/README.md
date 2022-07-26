# wj-config v1.0.2 Example - ReactJS

This is an example built for `wj-config` v1.0.2.  It was created using the Create React App tool that created the 
application with **ReactJS** v18.2.0.

## Running in Visual Studio Code

This repository contains the `launch.json` file already configured.  Simply run the configuration named 
**Launch React Example v18.2.0 - v1.0.2**.

This configuration has a pre-launch task that takes care of starting the NPM server (the `npm start` command), so no 
need to run this yourself.

## What Is Demonstrated Here

This example shows:

1. How the `/src/config.js` file should be coded.
2. How to consume configuration from React components (see `App.js` and `components/PersonsTable.js`).
3. How to consume configuration from services (see `services/country-service.js`).
4. How to configure environment variables as an object of the global `window` object (see `public/config.js` and 
`public/index.html`).
5. How to define environment variables for local testing/development (see `src/config.js` and 
`.env.development.local`).
6. How to consume the generated `environment` object in configuration (see `App.js`).

## Environment Variables in React with WJ-Config

> This is an opinionated way to achieve environment variables in **ReactJS**.  There are more ways and you are invited 
> to explore any other ways you wish.  Surely there will be other methods of doing this.

The `wj-config` configuration package should largely eliminate the need for environment variables.  However, if the 
need for environment variables arise, then configure them in the `.env.development.local` file and alter your 
`config.js` file to load from `process.env` if running locally (usually this means the `Development` environment), or 
from `window.env` if deployed somewhere (any other environment).  This is how is actually done in this example.

The advantage of this process is that you can (and should) exclude the `.env.development.local` file from source 
control and then there won't be any potential secrets in source control while still having everything that is needed 
for a successful deployment in source control.

The deployment part can be done in several ways explained in the 
[deployment folder's readme file](https://github.com/WJSoftware/wj-config/tree/main/deployment), where you can also 
find the `cpenv` script (in **Powershell** and **bash** flavors) that copies environment variables from the system and 
dumps them in the form of JavaScript that can be used to set `window.env`.

__________________

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
