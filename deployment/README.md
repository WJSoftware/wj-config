# Deployment

> **At this time, there is no need for deployment-specific tools for server-sided code, so all  this is for React 
> (or browser-sided libraries/frameworks) deployments**.

This folder contains one bash script and one Powershell script that do the same thing:  Read the system environment 
variables and output JavaScript that assigns the qualifying environment variables to `window.env`.

This is a valid deployment methodology for **React** applications and probably works for other frameworks or 
technologies for the browser (if you would like to contribute, please fork and pull request).

The idea here is to create a JavaScript file with the output of the script and apply it when the web application first 
loads in the browser, usually with a `script` tag in the homepage or main layout page.

## Example

Let's imagine the Operating System has the following environment variables defined, either because they were specified 
as part of a Kubernetes deployment/pod specs or they are included from Kubernetes secrets, or maybe because they were 
manually set, or whatever other reason:

| Environment Variable | Value |
| - | - |
| APP_ENVIRONMENT | PreProduction |
| APP_ENV_TRAITS | 5 |
| OPT_gateway__host | localhost |
| OPT_ldap__username | sys_myapp |
| OPT_ldap__password | cat_on_keyboard |

These variables are needed by a **React** application because we want them injected by 
[`wj-config`](https://github.com/WJSoftware/wj-config) and for whatever reason they were not added to the JSON 
configuration files.

If deploying as a Docker image, we could create a script that first runs the `cpenv` script found here and whose 
output is redirected to the file `env.js` in the deployed application's root folder.  Once that is done, the script 
can start whichever web server is used in said Docker image:

```bash
# Assuming NGINX with the React app deployed to /usr/shared/nginx/html.
cpenv.sh OPT_ APP_ENVIRONMENT APP_ENV_TRAITS>/usr/shared/nginx/html/env.js
# Now that the `env.js` file has been created/overwritten we can start NGINX.
nginx -g "daemon off;"
```

If using Powershell, you could redirect with `>`, but if that is troublesome because of the encoding, try doing it 
like this:

```powershell
.\cpenv.ps1 OPT_ APP_ENVIRONMENT APP_ENV_TRAITS | Set-Content .\env.js -Encoding UTF8 # Or whatever encoding you want/need.
```

It would result an `env.js` file whose contents would be:

```javascript
window.env = {
    APP_ENVIRONMENT: 'PreProduction',
    APP_ENV_TRAITS: '5',
    OPT_gateway__host: 'localhost',
    OPT_ldap__username: 'sys_myapp',
    OPT_ldap__password: 'cat_on_keyboard'
};
```

We would have made sure that `index.html` would include the script with:

```html
<script src="env.js" type="text/javascript"></script>
<!--
    Or for React:
-->
<script src="%PUBLIC_URL%/env.js" type="text/javascript"></script>
```

Which should complete the needful:  To define `window.env` as an object that contains the application's pertinent 
environment variables.

## Usage

Both versions of the script are used in the same way:

```
cpenv[.sh|.ps1] <prefix> <env variable name> <env traits name>
```

Where `<prefix>` is the environment variable prefix configured in `wj-config`, `<env variable name>` is the name of 
the environment variable that holds the application's environment name and `<env traits name>` is the name of the 
environment variable that holds the application's environment's traits (since **wj-config v2.0.0**).

None of the arguments are required.  Prefix, if not provided, will default to the `wj-config`'s default value `OPT_`.

While the other arguments are optional, the entire thing is probably non-functional.  If you omit the environment 
variables for the environment name and traits, make sure you have already devised an alternative method to configure 
those, or you won't be able to harness the full potential of **wj-config**.

## Running Locally

This is not meant to be used locally (in the developer's local machine).  This is only used when deploying to a server.

Locally, you will have in your HTML static content folder (`/public` in **React**) an `env.js` file that specifies the 
values you want for local development work.

If you have passwords or other sensitive data that cannot be commited to source control inside of `env.js` (which you 
should not because this is rarely the case for browser applications), you have 2 options:

1. Exclude `env.js` from source control.
2. Use this script as a prerequisite to running your application.  You can do this in Visual Studio Code.

For #2, you can then define your sensitive data in environment variables and use the script to generate `env.js`.  If 
using Visual Studio Code, then you can define your environment variables in the `.vscode/launch.json` file.
