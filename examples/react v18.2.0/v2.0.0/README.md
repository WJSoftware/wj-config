# wj-config v2.0.0 Example - ReactJS

This is an example built for `wj-config` v2.0.0.  It was created using the Create React App tool that created the 
application with **ReactJS** v18.2.0.

## Running in Visual Studio Code

As a first step, make sure you run `npm i` or `npm ci` in the example's folder to install all package dependencies.

This repository contains the `launch.json` file Visual Studio Code requires already configured.  Simply run the 
configuration named **Launch React Example v18.2.0 - v2.0.0**.

This configuration has a pre-launch task that takes care of starting the NPM server (the `npm start` command), so no 
need to run this yourself.

## Environment Variables in React with WJ-Config

> This is an opinionated way to achieve environment variables in **ReactJS**.  There are more ways and you are invited 
> to explore any other ways you wish.  Surely there will be other methods of doing this.

The `wj-config` configuration package should largely eliminate the need for environment variables.  However, if the 
need for environment variables arise, then you may proceed as shown in this example:  Create the `public/env.js` file 
and import it using a script tag in your index page.  This file defines the `window.env` object.  Add "environment" 
variables to this object following the environment variable name convention if you wish for `wj-config` to use them as 
a data source.

As explained by the package's README, you need to specify two values outside the realm of `wj-config` somewhere.  You 
can use `window.env` to transmit the environment name and the environment traits.  This is done in this example.

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
