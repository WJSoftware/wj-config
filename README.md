# wj-config

> Javascript configuration module for NodeJS and React that works like ASP.net configuration where 2 JSON's are merged 
> and environment variables can contribute/overwrite values by following a naming convention.

Welcome to **wj-config**.  This is a Javascript library that can be used for almost any type of project, including but 
not limited to, **NodeJS** and **React** applications.

This package provides a module that, when imported, provides a configuration function that is used to initialize the 
configuration mechanism with the configuration data.  At its simplest, it requires one object whose properties contain 
the different configuration values for your application.  In practical terms, it should be a loaded JSON file.

## Features

In a nutshell, this configuration package will:

+ Merge 2 JSON sources as one, just like ASP.net configuration loads `appsettings.json` and `appsettings.<environment>.json`.
+ Optionally (and enabled by default) will create a third JSON source from environment variables that start with a set 
prefix and that follow the same convention that ASP.net uses:  Hierarchy levels are separated by double underscores.
+ After the above sources are merged, a special property (name configurable, but by default is `ws`) will be parsed 
and its contents will undergo a transformation to easily build URL's from the information contained within.
+ Provide an environment object with the current environment name and helpful `isXXX()` functions to quickly create 
conditionals based on the current environment, just like .Net's `IHostEnvironment` interface.

## Quickstart

First, install the NPM package in your project.

2Do:  Add installation sample.

Now add one master JSON configuration file.  Name it as you wish; we encourage you to use `config.json`.  Add your 
configuration values in any form you like.  Especially in **React** applications, we configure a lot of backend URL's 
for all of the application functionality.  Dedicate one or more sections of the document to them.  By default, this 
configuration system uses the `ws` property.  Example:

```json
{
    "app": {
        "title": "My Awesome App",
        "system": "awe-app",
        "id": "awe-app-appshell"
    },
    "logging": {
        "verbosity": "information"
    },
    "ws": {
        "defaultTimeout": 30,
        "gateway": {
            "rootPath": "/api/v1",
            "login": "/login",
            "catalogue": {
                "rootPath": "/cat",
                "getAll": "",
                "single": "/{catId}"
            }
        }
    }
}
```

The above will be the backbone configuration for all your environments.  Most of the time, however, you'll probably 
have to tweak a particular value for a specific environment.  Therefore a new JSON file may be created.  Name it using 
the environment name, just like in ASP.net configuration:  `config.Developent.json`.  Then only specify the values 
that change.  Example:

```json
{
    "logging": {
        "verbosity": "debug"
    }
}
```

Now you're ready to load `wj-config`.  Create a module of yours called `config.js`.  Obtain the environment name, load 
the 2 JSON files and initialize the library.

### NodeJS

```js
const wjConfig = require('wj-config');
const fs = require('fs');

const loadJsonFile = fileName => {
    const data = fs.readFileSync(fileName, 'utf-8');
    return JSON.parse(data);
};
const envName = process.env.NODE_ENV;
const mainConfig = loadJsonFile('./config.json');
const envConfig = loadJsonFile(`./config.${envName}.json`);
const config = wjConfig({ main: mainConfig, override: envConfig }, envName);

module.exports = config;
```

### React

```js
import wjConfig from 'wj-config';
// In the browser we cannot load files at will unless we obtain from an HTTP call, but modules do not support async 
// loading, so the easiest is to just load all environment JSON files in different variables.
import mainConfig from './config.json';
import devConfig from './config.Development.json';
import preProdConfig from './config.PreProduction.json';
import prodConfig from './config.Production.json';

// We recommend setting REACT_APP_ENVIRONMENT as a property of an env object, that in turn is is property in the 
// window object and not use the .env REACT system at all.  The .env system is like C's macros that disapper once the 
// React app is built.  Read to the end of this Readme to see how this should be done.
const envName = window.env.REACT_APP_ENVIRONMENT;
let envConfig = null;
//Use a simple switch case to obtain the appropriate override config.
switch (envName) {
    case 'Development':
        envConfig = devConfig;
        break;
    case 'PreProduction':
        envConfig = preProdConfig;
        break;
    case 'Production':
        envConfig = prodConfig;
        break;
    default:
        throw new Error(`Unrecognized environment name "${envName}".`);
}
const config = wjConfig({ main: mainConfig, override: envConfig }, envName);

export default config;
```

At this point, your `config.js` module is ready to be imported or required anywhere in your project and it will 
contain the properties your JSON defines as well as an `environment` property with:

1. A `value` property that has the environment name provided when initializing the configuration.
2. One `isXXX()` function for each environment name provided during initialization (not shown in the examples above, 
so the library used the default names *Development*, *PreProduction* and *Production*).

**IMPORTANT**:  Because of this, `environment` is the only reserved keyword that  cannot be used in your configuration 
JSON files at the root level.  It can be used as property name in sub levels, though.

## URL Configuration

As mentioned above, this package has a special feature, which makes it unique and is probably the most amazing feature 
of them all:  It creates functions for configured URL's.  But what does this mean?  Let's review the quickstart 
example JSON.

Not explained before, but the example JSON given in quickstart intends to define the following 3 URL's:

1. /api/v1/login
2. /api/v1/cat
3. /api/v1/cat/{catId}

All were defined as relative URL's, but absolute URL's can also be built by providing, as a minimum, the `host` 
property.

### Mechanism

The URL mechanism built in this library aims towards minimizing the amount of data typed.  For example, one host 
specification can be made to apply to all the 3 configured URL's above.  You can probably guess that this is also true 
for common pieces of paths, specified in the `rootPath` properties.  Yes, properties.  Each level may provide a new 
root path that is appended to all previous root paths.

Ok, but how can the developer obtain the complete URL?  Thanks to this library, this is actually trivial:  Every 
"leaf" property in the various sub-objects under the `ws` object are converted to functions that return the fully 
built URL.  For example, the `single` property in the path `ws.gateway.catalogue` is converted to a function:

```js
import config from './config';

const singleCatalogueUrl = config.ws.gateway.catalogue.single(); // Just like that.
console.log(singleCatalogueUrl); // Shows /api/v1/cat/{catId}
```

Ok but what is that thing, `{catId}`?  Well, it is a replaceable route value, and even though we call them *route* 
values here, they may also appear in query strings.  These values can be replaced using the same function above:

```js
import config from './config';

const catalogueId = 123;
// Using an object as dictionary:
const singleCatalogueUrl = config.ws.gateway.catalogue.single({ catId: catalogueId });
// Or using a function:
const singleCatalogueUrl = config.ws.gateway.catalogue.single(name => {
    switch (name) {
        case 'catId':
            return catalogueId;
            break;
        default:
            throw new Error(`Unrecognized replaceable route value "${name}".`);
    }
});
// Or using a function when you know is just one replaceable value:
const singleCatalogueUrl = config.ws.gateway.catalogue.single(n => catalogueId);
console.log(singleCatalogueUrl); // Shows /api/v1/cat/123
```

Personally, for single replacements the 3rd version is the one that appeals the most to me, and for multiple 
replacements the 1st one appeals the most to me, but feel free to choose whichever form you prefer.

At this point you have probably realized the excellent potential of this feature, but most people don't realize the 
most amazing consequence of using this feature:  The position of the replaceable route values do not affect your code!

For example, you could define the URL `/api/vi/users?id={id}&format={format}` and later on decide that the ID will be 
part of the URL and not the query string, modifying it to `/api/v1/users/{id}?format={format}` and your function call 
does not have to change at all.  Your code does not care about the position of replaceable route values.

### Dynamic URL's

As if all of the above weren't enough to convince you this is the best configuration package available, you may also 
create dynamic URL's with the same mechanism.

Every non-leaf object in a web services path in your configuration is granted the `buildUrl()` function that works 
exactly the same as the leaf functions but also accepts a path.  Using the same configuration example as before, we 
have the following `buildUrl()` functions:

```js
const dynGw = config.ws.gateway.buildUrl('/some/path/dynamically/obtained');
console.log(dynGw); // Shows /api/v1/some/path/dynamically/obtained
const dynCat = config.ws.gateway.catalogue.buildUrl('/dyn/url/{catId}/statistics?format={format}', { catId: 123, format: 'short' });
console.log(dynCat); // Shows /api/v1/cat/123/statistics?format=short
```

### Reserved Names for Web Services

All this URL magic comes with special properties that can be set to fully customize the created URL's.  These names 
cannot be used as leaf properties, as you may have already guessed.

| Property | Data Type | Sample Value | Description |
| - | - | - | - |
| `host` | String | 'localhost' | The host's name that applies to all URL's defined in the sub hierarchy.  Leave blank to create relative URL's. |
| `port` | Number | 4000 | The host's listening port number.  Do not specify if you are using the default port for the scheme. |
| `scheme` | String | 'https' | The scheme used to connect to the host.  When not specified, it is `http`. |
| `rootPath` | String | '/api' |  Optional root path that is applied downstream to all URL creation down the sub hierarchy. |

To make it perfectly clear, here is the quickstart example evolved to use hosts and web socket scheme.

```json
{
    "app": {
        "title": "My Awesome App",
        "system": "awe-app",
        "id": "awe-app-appshell"
    },
    "logging": {
        "verbosity": "information"
    },
    "ws": {
        "defaultTimeout": 30,
        "gateway": {
            "host": "localhost",
            "scheme": "https",
            "port": 1122,
            "rootPath": "/api/v1",
            "login": "/login",
            "catalogue": {
                "rootPath": "/cat",
                "getAll": "",
                "single": "/{catId}"
            }
        },
        "gwSockets": {
            "host": "localhost",
            "scheme": "wss",
            "port": 1122,
            "rootPath": "/ws",
            "support": {
                "rootPath": "/support",
                "chat": "/chat?userId={userId}"
            }
        }
    }
}
```

Now the above will get you the URL's:

+ https://localhost:1122/api/v1/login
+ https://localhost:1122/api/v1/cat
+ https://localhost:1122/api/v1/cat/{catId}
+ wss://localhost:1122/ws/support/chat?userId={userId}

**IMPORTANT**:  The `host`, `port` and `scheme` values cannot be changed once set, and this is why a new sub hierarchy 
is created for the web socket URL's.

### Configuration

In reality, the configuration initialization function accepts as third argument an options object.  This options 
object, in its default state looks like this:

```js
const defaultOptions = {
    includeEnv: true,
    env: (process ?? window)?.env,
    envPrefix: 'OPT_',
    envNames: [
        'Development',
        'PreProduction',
        'Production'
    ],
    wsPropertyNames: ['ws']
};
```

| Property | Value Type | Sample Value | Description |
| - | - | - | - |
| `includeEnv` | Boolean | true | Turns on or off the inclusion of environment variables as source of configuration data. |
| `env` | Object | { REACT_APP_ENVIRONMENT: 'Development' } | Source object listing all environment variables. |
| `envPrefix` | String | 'OPT_' | Prefix that environment variables must have to be considered for configuration overrides. |
| `envNames` | Array(String) | [ 'MyDev', 'MyProd' ] | List of environment names for the project. |
| `wsPropertyNames` | Array(String) | [ 'ws', 'altWs' ] | List of property names found in the config JSON objects that are URL sources. |

If nothing is passed as options, the above default options will be in effect.

**IMPORTANT**:  You may only pass overrides, just like when you override configurations for a specific environment 
using an environment-specific JSON object.  If you, say, only want to set `includeEnv` to `false`, then just pass that:

```js
const config = wjConfig({ main: mainConfig, override: envConfig }, envName, { includeEnv: false });
```

The above will not override other default property values.

To disable the inclusion of environment variables as contributors to configuration values, set `includeEnv` to false.

To disable the URL construction feature everywhere, provide an empty array for the `wsPropertyNames` property.  If 
you wish to store the URL's configuration in a different property, then set the name or names in a new array on this 
property.

Do include your list of environment names in the `envNames` property as they shape up the `environment` property object.

###  Environment Object

As mentioned already in several other places, the configuration object is granted an `environment` property whose 
value is an object with the `value` property, and as many `isXXX()` functions as there are environments.  Assuming the 
names on the default configuration, the object will have `isDevelopment()`, `isPreProduction()` and `isProduction()`.

The functions return a Boolean response based on the stored value in `value`.  This is an example of how this object 
would look like for the quickstart example:

```js
{
    value: 'Development',
    isDevelopment: function() { ... },
    isPreProduction: function() { ... },
    isProduction: function() { ... }
}
```

## React-Specific Notes

A React application is a collection of static content.  All of the Javascript in the `/src` folder is bundled and 
minified when `npm run build` is executed.  Furthermore, the .env configuration system is also applied, replacing 
every **process.env.REACT_APP_XXX** instance with its configured value (read more @ [Create React App web](https://create-react-app.dev/docs/adding-custom-environment-variables/)).

Because the .env configuration system is so simple, it is quite a challenge to configure dozens or hundreds of values 
using this system, which is commonly the case, especially in microservices/micro frontends.

This configuration system comes to replace the .env system completely.  One value, however, must be set outside this 
system, and that value is the environment name.

Because of my experience with micro frontends, my recommendation is to create a `config.js` file in the `/public` 
React folder whose contents will be the following:

```js
window.env = { REACT_APP_ENVIRONMENT: 'Development' };
```

This JS file needs to be added to the index page using a script tag:

```html
<script src="config.js" type="text/javascript"></script>
```

(Please pardon my HTML if it is somehow incorrect.  Hopefully you get the idea.)

Now, when deploying, deploy a version of this `config.js` that has the correct environment name.  Especifically with 
Rancher/Kubernetes, this can be done easily by creating a **ConfigMap** and mounting said **ConfigMap** in the file 
system.  Finally use a bash script as entry point in the Docker image to overwrite `/public/config.js` with the 
contents of the mounted volume and then start your HTTP server (could be NGINX or any other).

## Using Environment Variables as Configuration Source

If you are careful enough, you do not want to store sensitive information in configuration files, such as passwords of 
system accounts and the like.

Environment variables can be used to provide configuration data whenever said data should not be available in source 
control systems.

To illustrate this, imagine we need the username and password of a system account in our **NodeJS** HTTP server.  The 
following would be the wrong way to store the password in the JSON config file:

```json
{
    "myRemoteSystem": {
        "username": "my_sys_id",
        "password": "I should not be here!"
    }
}
```

With environment variables, however, we CAN provide the value in the desired path **myRemoteSystem.password** and 
still comply with the no-passwords-in-source-control policy.  Simply add an environment variable named 
`OPT_myRemoteSystem__password` using your preferred deployment method (in Rancher/Kubernetes you define a secret and 
then mount it as environment variable).  Set the actual password as the value of the environment variable.

Once this is done, it can be accessed as if it had been specified in the JSON config file all along:

```js
const config = require('./config'); // Your own config.js file as explained in the Quickstart section.

const username = config.myRemoteSystem.username;
const password = config.myRemoteSystem.password;
```

Those used to ASP.net Configuration will find this behavior incredibly familiar.

### The Environment Variable Name Explained

For an environment variable to successfully contribute to the configuration, it must comply with 2 rules:

1. Start with the configured prefix as explained above using the `envPrefix` property.
2. Use double underscore (__) to separate the hierarchy levels until the leaf value is reached.

In the example above, the environment variable's name starts with `OPT_`, the default prefix.  It then specifies the 
first hierarchy name, `myRemoteSystem`, and finally ends with the leaf property name, `password`.  Note that deeper 
hierarchies can be specified by adding more hierarchy names separated by double underscores.

**IMPORTANT**:  Because Javascript is a case-sensitive object, the environment variable names must match the property 
names' case exactly.

### Environment Variable Value Conversion

Whenever an environment variable is used as source of configuration values the library will attempt to parse the 
variable value as a Boolean, integer, or floating point number.  The algorithm will follow this order:

1. Try to convert the words `true` or `false` to a native Boolean value.
2. Try to convert the value to an integer value.  The environment variable's value can be specified in decimal or in 
hexadecimal notation (0xABC).
3. Try to convert the value to a floating point number.
4. If no parsing succeeds, then the value is kept as a string value.

