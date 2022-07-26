# Deployment

This folder contains one bash script and one Powershell script that do the same thing:  Read the system environment 
variables and output JavaScript that assigns the qualifying environment variables to `window.env`.

This is a valid deployment methodology for **React** applications and probably works for other frameworks or 
technologies for the browser (if you would like to contribute, please fork and pull request).

The idea here is to create a JavaScript file with the output of the script and apply it when the web application first 
loads in the browser, usually with a `script` tag in the homepage or main layout page.

## Example

Let's imagine the Operating System has the following environment variables defined, either because they were specified 
as part of a Kubernetes deployment/pod or because they were manually set, or whatever other reason:

| Environment Variable | Value |
| - | - |
| APP_ENVIRONMENT | PreProduction |az
| OPT_gateway__host | localhost |
| OPT_ldap__username | sys_myapp |
| OPT_ldap__password | cat_on_keyboard |

These variables are needed by a **React** application because we want them injected by 
[`wj-config`](https://github.com/WJSoftware/wj-config) and for whatever reason they were not added to the JSON 
configuration files.

If deploying as a Docker image, we could create a script that first runs the `cpenv` script found here and whose 
output is redirected to the file `config.js` in the deployed application's root folder.  Once that is done, the script 
can start whatever web server is used in said Docker image:

```bash
# Assuming NGINX with the React app deployed to /usr/shared/nginx/html.
cpenv.sh OPT_ APP_ENVIRONMENT>/usr/shared/nginx/html/config.js
# Now that the `config.js` file has been created/overwritten we can start NGINX.
nginx -g "daemon off;"
```

We would have made sure that `index.html` would include the script with:

```html
<script src="config.js" type="text/javascript"></script>
<!--
    Or for React:
-->
<script src="%PUBLIC_URL%/config.js" type="text/javascript"></script>
```

Which should complete the needful:  To define `window.env` as an object that contains the application's pertinent 
environment variables.

## Usage

Both versions of the script are used in the same way:

```
cpenv[.sh|.ps1] <prefix> <env variable name>
```

Where `<prefix>` is the environment variable prefix configured in `wj-config`, and `<env variable name>` is the name 
of the environment variable that holds the application's environment name.  The former is required while the latter is 
optional.

In the example shown above, the expected environment variable prefix is the default, `OPT_`, and the environment 
variable holding the application's environment name is `APP_ENVIRONMENT`.

## Running Locally

This is not meant to be used locally (in the developer's local machine).  Instead use the `.env` series of files (see 
about this @ the [dotenv project home](https://github.com/motdotla/dotenv)) to define environment variables that are 
then accessible through `process.env`.  The 
[ReactJS example's README](https://github.com/WJSoftware/wj-config/tree/main/examples/react%20v18.2.0/v1.0.2) provided 
in this repository explains this in detail.
