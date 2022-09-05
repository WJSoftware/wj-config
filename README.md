# wj-config

[![NPM](https://nodei.co/npm/wj-config.png)](https://nodei.co/npm/wj-config/)

> Javascript configuration module for **NodeJS** and browser frameworks such as **React** that works like ASP.net 
> configuration where data sources are specified (usually JSON files) and environment variables can 
> contribute/overwrite values by following a naming convention.

Welcome to **wj-config**.  This is a Javascript library that can be used for almost any type of project, including but 
not limited to, **NodeJS** and **React** applications.

This package provides a module that, when imported, provides a configuration function that when evaluated creates a 
builder object where data sources and other configurations are specified.  At its simplest, it requires one object 
whose properties contain the different configuration values for your application.  In practical terms, it should be a 
loaded JSON file, but generally speaking it could be any data source (definition and list [here](#all-available-data-sources)).

This package has no package dependencies.  It is written fully in TypeScript and is meant for modern JavaScript 
support, meaning recent **NodeJS** and recent browsers.  To be more technical:  It is a package transpiled to ES 
modules, so you need a recent version of **NodeJS** to be able to write your application with either ES modules or, if 
you insist in using CommonJS modules, to be able to use 
[dynamic `import()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import).

## Features

In a nutshell, this configuration package provides:

+ The ability to merge any number of JSON sources as one, just like ASP.net configuration loads `appsettings.json` and 
`appsettings.<environment>.json` from the file system.  In **NodeJS** you can read the file system (see Quickstart), 
and in **React** you could either `fetch()` the JSON content or directly import JSON files in the source (see 
Quickstart).
+ A JSON source that reads environment variables that start with a set prefix and that follow the same convention 
that ASP.net uses:  Hierarchy levels are separated by double underscores.  The prefix is configurable.
+ Other JSON data sources such as dictionaries and single value data sources.
+ The ability to create special functions from data that is meant to be used to construct URL's.  The created 
functions provide route replacement values, query string generation and URL encoding of replacement values.
+ An environment object with the current environment name and helpful `isXXX()` functions to quickly create 
conditionals based on the current environment, just like .Net's `IHostEnvironment` interface.
+ Configuration value tracing:  If needed for troubleshooting or debugging, the configuration builder will also create 
a full trace of all configuration values in the `_trace` property of the resulting configuration object.

## Examples

There are working examples of use in GitHub [here](https://github.com/WJSoftware/wj-config/tree/main/examples).  Feel 
free to explore them and to contribute.

| Technology | wj-config Version | Technology Version | Development Port |
| - | - | - | - |
| ReactJS | v1.0.2 | ReactJS v18.2.0 | 3001 |
| NodeJS Express | v1.0.2 | Express v4.16.1 | 3002 |
| ReactJS | v1.1.0 | ReactJS v18.2.0 | 3003 |
| NodeJS Console (CommonJS) | v2.0.0 | v18.1.0 |
| NodeJS Console (ES Modules) | v2.0.0 | v18.1.0 |
| NodeJS Express (CommonJS) | v2.0.0 | Express v4.16.1 | 3004 |
| NodeJS Express (ES Modules) | v2.0.0 | Express v4.18.1 | 3005 |
| ReactJS | v2.0.0 | v18.2.0 | 3006 |

The repository contains the necessary `launch.json` file to run each of the examples in *Visual Studio Code*.

## Quickstart

First, install the NPM package in your project.

```bat
npm install wj-config
```

Now add one master JSON configuration file.  Name it as you wish; this ReadMe assumes `config.json`.  Add your 
configuration values arranged any way you want:  You may add the properties directly to the main object, or you may 
create properties that are objects that hold the actual properties you care about.  This is encouraged to "section" 
your configuration values by grouping them logically.

Especially in **React** applications, a lot of backend URL's for all of the application's functionality is configured, 
so dedicate one or more sections of the JSON document to them.  By default, this configuration system assumes that the 
URL's will be stored in the `ws` property.

**IMPORTANT**:  To be able to easily configure per-environment hosts, ports or other parts of the URL's, this 
configuration system works with individual `host`, `port` and `scheme` properties.  The example won't show any of 
these because it is an example that produces *relative* URL's.  For detailed information see the 
[URL Configuration](#url-configuration) section below.

Example:

```json
{
    "app": {
        "title": "My Awesome App",
        "system": "awe-app",
        "id": "awe-app-appshell"
    },
    "logging": {
        "minLevel": "information"
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
        "minLevel": "debug"
    }
}
```

Now you're ready to load `wj-config`.  Create a module of yours called `config.js`.  Obtain the environment name, load 
the 2 JSON files and initialize the library.

### NodeJS ES Modules (Recommended)

```js
import wjConfig, { Environment } from 'wj-config';
import mainConfig from "./config.json" assert {type: 'json'}; // Importing data is a thing in NodeJS.
import fs from 'fs';

// If importing JSON was not a thing in NodeJS, mainConfig would be the result of calling this function.
const loadJsonFile = (fileName, isRequired) => {
    const fileExists = fs.existsSync(fileName);
    if (fileExists) {
        const data = fs.readFileSync(fileName);
        return JSON.parse(data);
    }
    else if (isRequired) {
        throw new Error(`Configuration file ${fileName} is required but was not found.`);
    }
    // Return an empty object.
    return {};
};

// Obtain an environment object ahead of time to help setting up configuration.
const env = new Environment(process.env.NODE_ENV);

const config = wjConfig()
    .addObject(mainConfig)
    .name('Main Configuration') // Give data sources a meaningful name for value tracing purposes.
    .addObject(loadJsonFile(`./config.${env.value}.json`))
    .name(`${env.name} Configuration`)
    .addEnvironment(process.env) // Adds a data source that reads the environment variables in process.env.
    .includeEnvironment(env) // So the final configuration object has the environment property.
    .createUrlFunctions() // So the final configuration object will contain URL builder functions.
    .build(env.isDevelopment()); // Only trace configuration values in the Development environment.

export default await config; // The build() function is asynchronous, so await the result.
```

### NodeJS CommonJS Modules (If You Must)

```js
const fs = require('fs');

const loadJsonFile = (fileName, isRequired) => {
    const fileExists = fs.existsSync(fileName);
    if (fileExists) {
        const data = fs.readFileSync(fileName);
        return JSON.parse(data);
    }
    else if (isRequired) {
        throw new Error(`Configuration file ${fileName} is required but was not found.`);
    }
    // Return an empty object.
    return {};
};

// Export the result of an IIFE, which will be a promise to return the configuration object.  This means that code in 
// need for the configuration object will have to execute inside async functions to be able to await, or wrap the 
// whole thing within a call to .then(), like in the example provided in this project's repository.
// This is why CommonJS is discouraged.  It makes things more complex.
module.exports = (async function () {
    const { default: wjConfig, Environment } = await import('wj-config');
    const env = new Environment(process.env.NODE_ENV);
    return wjConfig()
        .addObject(loadJsonFile('./config.json', true))
        .name('Main Configuration') // Give data sources a meaningful name for value tracing purposes.
        .addObject(loadJsonFile(`./config.${env.value}.json`))
        .name('Env Configuration')
        .addEnvironment(process.env) // Adds a data source that reads the environment variables in process.env.
        .includeEnvironment(env) // So the final configuration object has the environment property.
        .createUrlFunctions() // So the final configuration object will contain URL builder functions.
        .build(env.isDevelopment()); // Only trace configuration values in the Development environment.
})();
```

### React

> **IMPORTANT**:  Eject or use the `@craco/craco` package and configure webpack to allow top-level awaits.  Details in 
> the [React section](#react-specific-notes).

```js
import wjConfig, { Environment } from 'wj-config';
import mainConfig from './config.json'; // One may import data like this, or fetch it.

const env = new Environment(window.env.REACT_ENVIRONMENT);
const config = wjConfig()
    .addObject(mainConfig)
    .name('Main Configuration') // Give data sources a meaningful name for value tracing purposes.
    .addFetchedConfig(`./config.${env.value}.json`, false) // Fetch the JSON from the /public folder.
    .addEnvironment(env.isDevelopment() ? process.env : window.env, 'REACT_APP_') // Adds a data source that reads the environment variables in process.env.
    .includeEnvironment(env) // So the final configuration object has the environment property.
    .createUrlFunctions() // So the final configuration object will contain URL builder functions.
    .build(env.isDevelopment()); // Only trace configuration values in the Development environment.

export default await config;
```

At this point, your `config.js` module is ready to be imported or required anywhere in your project and it will 
contain the properties your JSON files defined as well as an `environment` property with:

1. A `value` property that has the environment name provided when initializing the configuration.
2. A `names` property that has the list of all possible environment names.
2. One `isXXX()` function for each environment name provided during initialization (not shown in the examples above, 
so the library used the default names *Development*, *PreProduction* and *Production*).

**IMPORTANT**:  The `environment` property is named like this by default, but its name can be specified.

## URL Configuration

> Since **v1.0.0**

As mentioned above, this package has a special feature, which makes it unique and is probably the most amazing feature 
of them all:  It creates functions for configured URL's.  But what does this mean?  Let's review the 
[Quickstart](#quickstart) example JSON.

Not explained before, but the example JSON given in [Quickstart](#quickstart) intends to define the following 3 URL's:

1. /api/v1/login
2. /api/v1/cat
3. /api/v1/cat/{catId}

All were defined as relative URL's, but absolute URL's can also be built by providing, as a minimum, the `host` 
property.

### Mechanism

The URL mechanism built in this library aims towards minimizing the amount of data typed, which in turn allows for 
easy per-environment overrides.  For example, one host specification can be made to apply to all the 3 configured 
URL's above.  You can probably guess that this is also true for common pieces of paths, specified in the `rootPath` 
properties.  Yes, properties in plural form.  Each level may provide a new root path that is appended to all previous 
root paths.  It so stands that if the host needs to be overridden for a specific environment, it is just as easy as 
overriding it once in an environment-specific data source (such as a JSON file).

Ok, but how can the developer obtain the complete URL?  Thanks to this library, this is actually trivial:  Every 
"leaf" property *whose value is of type string* (new in **v2.0.0**) in the various sub-objects under the `ws` object 
are converted to functions that return the fully built URL.  For example, the `single` property in the path 
`ws.gateway.catalogue` in the [Quickstart](#quickstart) example is converted to a function:

```js
import config from './config.js';

const singleCatalogueUrl = config.ws.gateway.catalogue.single(); // Just like that.
console.log(singleCatalogueUrl); // Shows /api/v1/cat/{catId}
```

Ok but what is that thing, `{catId}`?  Well, it is a replaceable route value, and even though they are called *route* 
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
console.log(singleCatalogueUrl); // Shows /api/v1/cat/123 for all the presented variants above.
```

**NOTE**: The values of replaceable values are URL encoded by the function.

At this point you have probably realized the excellent potential of this feature, but most people don't realize the 
most amazing consequence of using this feature:  The position of the replaceable route values do not affect your code!

For example, you could define the URL `/api/vi/users?format={format}&id={id}` and later on decide that the ID will be 
part of the URL and not the query string, modifying it to `/api/v1/users/{id}?format={format}` and your function call 
does not have to change at all!  Your code does not care about the position of replaceable route values.

### About the Replaceable Values

> Since **v2.0.0**

By default, a replaceable value is defined as `{<name goes here>}`.  This is defined by a regular expression defined 
in the library itself.  This is, however, just a default regular expression.  When calling the `createUrlFunctions()` 
function in the builder object, a new regular expression may be specified, and the only requirement is that the first 
capturing group be the replaceable value's name identifier.  If, for example, you prefer to define route values like 
**NodeJS Express** (`:name`), then do this:

```js
const config = wjConfig()
    .addXXX() // Any data source or sources.
    // First character cannot be a number to avoid including the host's port number by mistake.
    .createUrlFunctions(null, /\:([a-zA-z]\w+)/)
    .build();
```

As you probably infer by the comment in the sample code, the regular expression is applied to the fully constructed 
url, so be sure not to match the port specification itself.

#### Dynamic Query Strings

> Since **v2.0.0**

The URL building functions generated by this mechanism accepts another argument to cover the cases where a query 
string may be optional and therefore cannot be set ahead of time in the configuration JSON/data sources.

This argument can be:

+ A string or a function that returns a string.  In this case it is assumed the string is an already-built query 
string and therefore no encoding is done on it.  It is attached to the end of the URL.  The string must not include 
the `?` or a starting `&` as these are included by the URL building function.  Just return the joined key 
and value pairs.  Example: `abc=def&xyz=123`.
+ An object or a function that returns an object.  In this case the object is treated as a dictionary whose keys are 
the query string keys, and the values are, well, the values.  The values are URL encoded for you.

This next code piece continues the [Quickstart](#quickstart) example:

```js
const catalogueId = 123;
// Using a string.
const singleCatalogueUrl = config.ws.gateway.catalogue.single(n => catalogueId, 'format=full');
// Using a function that returns a string.
const singleCatalogueUrl = config.ws.gateway.catalogue.single(n => catalogueId, () => 'format=full');
// Using a dictionary object.
const singleCatalogueUrl = config.ws.gateway.catalogue.single(n => catalogueId, { format: 'full' });
// Using a function that returns a dictionary object.
const singleCatalogueUrl = config.ws.gateway.catalogue.single(n => catalogueId, () => { format: 'full' });
console.log(singleCatalogueUrl); // Shows /api/v1/cat/123?format=full for all the presented variants above.
```

**NOTE**:  You can mix this method with statically-added query strings in the config JSON/data sources.  For example, 
you could define the following JSON and also apply more query string pairs with the above method:

```json
{
    "ws": {
        "gateway": {
            "catalogue": {
                "quickSearch": "?maxRecords=100"
            }
        }
    }
}
```

```js
const searchKey = getSearchKeySomehow(); //let's say its value will be 'abc def'
const quickSearch = config.ws.gateway.catalogue.quickSearch(null, { search: searchKey });
console.log(quickSearch); // Shows /api/v1/cat/?maxRecords=100&search=abc%20def <-- URL Encoded!
```

### Dynamic URL's

> Since **v1.0.0**

As if all of the above weren't enough to convince you this is the best configuration package available, you may also 
create fully dynamic URL's with the same mechanism.

Every non-leaf object (node) in a web services path in your configuration is granted the `buildUrl()` function that 
works exactly the same as the leaf functions but also accepts a path.  Using the same configuration example as before, 
we have the following `buildUrl()` functions for immediate use:

```js
const dynGw = config.ws.gateway.buildUrl('/some/path/dynamically/obtained');
console.log(dynGw); // Shows /api/v1/some/path/dynamically/obtained
const dynCat = config.ws.gateway.catalogue.buildUrl(
    '/dyn/url/{catId}/statistics?format={format}',
    { catId: 123, format: 'short' } /*,
    { queryKey: queryValue}
    */
);
console.log(dynCat); // Shows /api/v1/cat/dyn/url/123/statistics?format=short
```

As seen in the commented code, the additional query string parameter is also available.

### Reserved Names for Web Services

All this URL magic comes with special properties that can be set to fully customize the created URL's.  These names 
cannot be used as properties for anything else than the below-stated purposes, as you may have already guessed.

| Property | Data Type | Sample Value | Description |
| - | - | - | - |
| `host` | String | 'localhost' | The host's name that applies to all URL's defined in the sub hierarchy.  Leave blank to create relative URL's. |
| `port` | Number | 4000 | The host's listening port number.  Do not specify if you are using the default port for the scheme. |
| `scheme` | String | 'https' | The scheme used to connect to the host.  When not specified, it is `http`. |
| `rootPath` | String | '/api' |  Optional root path that is applied downstream to all URL creation down the node hierarchy. |

To make it perfectly clear, here is the [Quickstart](#quickstart) example evolved to use hosts and the *web socket* 
and *https* schemes.

```json
{
    "app": {
        "title": "My Awesome App",
        "system": "awe-app",
        "id": "awe-app-appshell"
    },
    "logging": {
        "minLevel": "information"
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

**IMPORTANT**:  The `host`, `port` and `scheme` values cannot be changed down the hierarchy once set, and this is why 
a new sub hierarchy is created for the web socket URL's.

### A Note on What "Leaf" Properties Are

> Since **v1.0.0**

Before version 2, a property was a leaf property subject to conversion to a URL building function if it had a parent 
(defined by the presence of the `host` or `rootPath` properties) up in the hierarchy and its name did not start with 
an underscore (_) or was one of the reserved property names.

> Since **v2.0.0**

Now from version 2 onwards, the definition of a leaf property subject to function conversion also requires that the 
value be of type `string`.  This allows for non-string configuration values down the URL hierarchy for things like 
timeouts.  Now you could do:

```json
{
    "ws": {
        "defaultTimeout": 30,
        "gateway": {
            "rootPath": "/api/v1",
            "timeout" : 10,
            "longRunning": {
                "rootPath": "/lr",
                "timeout": 300,
                "myReport": "/superlongreport"
            }
        }
    }
}
```

Before v2, the timeout properties in the above JSON would have been converted to URL functions.  Now they are not 
because their values are not of type `string`.

###  Environment Object

> Since **v1.0.0**

As mentioned already in several other places, the configuration object is granted an `environment` property whose 
value is an object with the `value` property, a `names` property that contains the list of defined environments and as 
many `isXXX()` functions as there are environments.  Assuming the names on the default configuration, the object will 
have `isDevelopment()`, `isPreProduction()` and `isProduction()`.

The `isXXX()` functions return a Boolean response based on the stored value in `value`.  This is an example of how 
this object would look like for the [Quickstart](#quickstart) example:

```js
{
    value: 'Development',
    names: ['Development', 'PreProduction', 'Production'],
    isDevelopment: function() { ... },
    isPreProduction: function() { ... },
    isProduction: function() { ... }
}
```
> Since **v1.1.0**

The environment object can also be produced by itself before producing the final configuration object.  This is useful 
because it allows the developer to make some decisions inside the `config.js` module based on the current environment 
value.  See the [Quickstart](#quickstart) example above for a practical use of this.

```js
import { Environment } from 'wj-config';

const envName = window.env.REACT_ENVIRONMENT;
//Optionally also pass the environment names.
const environment = new Environment(envName /* , ['MyDev', 'MyTest', 'MyProd'] */);
// Now use it as you see fit.
if (environment.isDevelopment()) {
    // Do stuff.
}
```

As you probably guessed, this is only useful for the times where the configuration object is not yet available.  Once 
the configuration object is created, it comes in the `environment` property and it is therefore a futile exercise to 
create it separately.

> Since **v2.0.0**

In version 2 onwards, the environment object is not added by default, and a call to the builder's `includeEnvironment()` 
function must be added in order to include this property.

## React-Specific Notes

A React application is a collection of static content.  All of the Javascript in the `/src` folder is bundled and 
minified when `npm run build` is executed.  Furthermore, the `.env` configuration system is also applied, replacing 
every **process.env.REACT_APP_XXX** instance with its configured value (read more @ 
[Create React App web](https://create-react-app.dev/docs/adding-custom-environment-variables/)).

Because the `.env` configuration system is so simple, it is quite a challenge to configure dozens or hundreds of 
values using this system, which is commonly the case, especially in microservices/micro frontends.

This configuration system comes to replace the `.env` system completely.  One value, however, must be set outside this 
system, and that value is the environment name.

Because of my experience with micro frontends, my recommendation is to create a `config.js` file in the `/public` 
React folder whose contents will be the following:

```js
window.env = { REACT_ENVIRONMENT: 'Development' };
```

This JS file needs to be added to the index page using a script tag:

```html
<script src="%PUBLIC_URL%/config.js" type="text/javascript"></script>
```

(Please pardon my HTML if it is somehow incorrect.  Hopefully you get the idea.)

Now, when deploying, deploy a version of this `config.js` that has the correct environment name.  Especifically with 
Rancher/Kubernetes, this can be done easily by creating a **ConfigMap** and mounting said **ConfigMap** in the file 
system.  Finally use a bash script as entry point in the Docker image to overwrite `/public/config.js` with the 
contents of the mounted volume and then start your HTTP server (could be NGINX or any other).

An alternative method is to configure environment variables in the Pod (or the Docker image using the `ENV` 
instruction) and then having a script import the relevant environment variables from the OS into the JavaScript file, 
and for this specific purpose, this project has the 
[deployment folder](https://github.com/WJSoftware/wj-config/tree/main/deployment).  In it you can find a script that 
does exactly this.

**WORD OF CAUTION**:  Using a Pod template in Kubernetes is usually better than using the Dockerfile's `ENV` 
instruction because then the image is not tied to a specific environment.

This last alternative may be better than **ConfigMap**s because it enables the use of Kubernetes **Secrets**.

### How to Use Top-Level Await in React

All major browsers now support the top-level await feature as seen in the [can I use website](https://caniuse.com/?search=top%20level%20await).

The problem is that current React applications created with **Create React App** do not enable this feature for its 
webpack configuration, (and this may change in the future, so be on the lookout).

There are two possible solutions that I know of:

1. Eject.  That's right.  Simply run `npm eject` so the webpack configuration is readily available for modification.
2. Install `@craco/craco` from the [NPM global repository](https://www.npmjs.com/package/@craco/craco).  For modern 
React applications using `react-scripts` package v5.x install [version 7](https://www.npmjs.com/package/@craco/craco/v/7.0.0-alpha.7) 
(currently in alpha as I write this document).

The example provided in this repository uses the second option.  It is a super-simple thing to do and is done in a 
matter of 3 minutes.

## Using Environment Variables as Configuration Source

> Since **v1.0.0**

If you are careful enough, you do not want to store sensitive information in configuration files, such as passwords of 
system accounts and the like.

Environment variables can be used to provide configuration data whenever said data should not be available in source 
control systems.

To illustrate this, imagine we need the username and password of a system account in our **NodeJS** HTTP server.  The 
following would be the *wrong* way to store the password in the JSON config file:

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
import config from './config.js'; // Your own config module as shown in the Quickstart.

const username = config.myRemoteSystem.username;
const password = config.myRemoteSystem.password;
```

Those used to ASP.net Configuration will find this behavior incredibly familiar.

### The Environment Variable Name Explained

For an environment variable to successfully contribute to the configuration, its name must comply with 2 rules:

1. Start with the configured prefix.  The desired prefix is passed when calling the builder's `addEnvironment()` 
function.  If none specified, the default is `OPT_`.
2. Double underscores (__) separate the hierarchy levels until the leaf property is reached.

In the example above, the environment variable's name starts with `OPT_`, the default prefix.  It then specifies the 
first hierarchy name, `myRemoteSystem`, and finally ends with the leaf property name, `password`.  Note that deeper 
hierarchies can be specified by adding more hierarchy names separated by double underscores.

**IMPORTANT**:  Because JavaScript is a case-sensitive language, the environment variable names must match the 
property names' case exactly.

### Environment Variable Value Conversion

Whenever an environment variable is used as source of configuration values, the library will attempt to parse the 
variable value as a Boolean, integer, or floating point number.  The algorithm will follow this order:

1. Try to convert the words `true` or `false` to a native Boolean value.
2. Try to convert the value to an integer value.  The environment variable's value can be specified in decimal or in 
hexadecimal notation (0xABC).
3. Try to convert the value to a floating point number.
4. If no parsing succeeds, then the value is kept as a string value.

## All Available Data Sources

> Since **v2.0.0**

This is the complete list of readily available data sources in this package.

| Data Source Class | Builder Function | Description |
| - | - | - |
| `DictionaryDataSource` | `addDictionary()` | Adds the properties of a flat dictionary into the configuration hierarchy.  The property names traverse the hierarchy using a colon (:) as hierarchy separator.  An optional prefix may be specified too. |
| `EnvironmentDataSource` | `addEnvironment()` | Adds the given object as a dictionary whose prefix is mandatory and its hierarchy separator is double underscore (__). |
| `FetchedConfigDataSource` | `addFetchedConfig()` | Fetches data using `fetch()` and adds its result as configuration source.  The result of the call must of course be a JSON object. |
| `JsonDataSource` | `addJson()` | Adds the provided JSON string as source of configuration data.  The advantage here is that the JSON parser can be specified.  It could be the famous `JSON5` parser, for example.|
| `ObjectDataSource` | `addObject()` | Adds the specified object as source of configuration data. |
| `SingleValueDataSource` | `addSingleValue()` | Adds the specified key and value as source of configuration data.  Useful to import automatically created values from CI/CD or similar. |

There is also a public `add()` function in the configuration builder.  It accepts any object that implements the 
`IDataSource` interface, defined like this:

```typescript
    /**
     * Defines the capabilities required from data source information objects used in value tracing.
     */
    export interface IDataSourceInfo {
        /**
         * Provides the name of the data source instance that can be used in messages and logs.
         */
        name: string;

        /**
         * Index (position) of the data source object in the builder's list of data sources.
         */
        index?: number;
    }

    /**
     * Defines the capabilities required from data sources.
     */
    export interface IDataSource extends IDataSourceInfo {
        /**
         * Asynchronously obtains the object that will be used as building block in the creation of the final 
         * configuration object.
         */
        getObject(): Promise<ICoreConfig>;

        /**
         * Returns a data source information object on demand.  This is used when building a configuration object with 
         * value tracing.
         */
        trace(): IDataSourceInfo;
    }
```

Basically a data source must have a `name` and `index` properties.  These are used for value tracing.  A data source 
must provide a name for every instance but consumers of this libary can use the configuration builder's `name()` 
function to override it as they see fit.  This is actually shown in the [Quickstart](#quickstart) examples.

Then we have the functions.  The `getObject()` function is the most important one.  It returns the actual data to 
include in the final configuration object.  It must return the object itself with the hierarchy fully expanded.  The 
`trace()` function, on the other hand, supports value tracing and simply returns an object with the data source's 
`name` and `index` values.

The base class `DataSource` in this package provides the implementation of the `trace()` method.  Feel free to create 
any new data sources in your project by inheriting from this class.

```typescript
import { DataSource } from "wj-config";

export class MyDataSource extends DataSource {
    ...
}
```

## Value Tracing

> Since **v2.0.0**

If so desired or needed, every leaf property value in the final configuration object can be traced to its data source 
by enabling value tracing when calling the builder's `build()` function.  This is also shown in the 
[Quickstart](#quickstart).

When value tracing is enabled, the data merging algorithm will include a `_trace` property in the final configuration 
object that contains the same leaf properties in the same hierarchy as the configuration object.  The values of those 
properties, however, are objects of type `IDataSourceInfo`.  This basically means that the values are objects with 
`name` and `index` properties.

By tracing values you can know exactly which data source provided the final configuration value.  The `index` property 
will tell you the priority of the data source relative to the others, where a higher index implies a higher priority.

**IMPORTANT**:  Some data sources like the `ObjectDataSource` provide by default a generic name that is the same for 
all instances, making it impossible to distinguish in a trace between two of these.  This is where the builder's 
`name()` function comes in handy.  Use it to set meaningful names to data sources so it is easy to understand data 
traces.

## Advantages of v2.0.0

The following is a list of improvements over the v1 versions and should be compelling reasons for upgrading.

1. The developer can easily enforce an order of priority for the various possible configuration sources.
2. Configuration objects are no longer required; easily can `wj-config` be set to work with say, just environment 
variables.
3. Any arbitrary number of objects can be provided, not just 1 or 2 as in v1.
4. New packages can be created that extend the list of sources.
5. No global default options.  Each option that requires a default is handled by its corresponding function in the 
builder.  It is much simpler to understand and remember.
6. Adds the possibility of other file formats as source of configuration, which could be generated by CI/CD.
7. The `environment` object is optional, freeing this name for custom use, if desired.
8. The `environment` object, if included, can be stored in the optionally provided property name, also freeing the 
name for custom use.
9. URL function creation is optional, not wasting processor time if none are needed or desired, crazy as that sounds.
10. If an environment object is created ahead of time, it can be given to the builder in order to preserve a bit more 
of that processing power.
11. The URL building functions now URL-encode all values.
12. The URL building functions now accept a query string-specific argument for dynamic query string building, 
something not found at all in v1.
13. Debug your configuration easily:  Every value in the final configuration object can be traced to its data source.
14. Because data sources work asynchronously, fetching configuration data from a server is an option now.
