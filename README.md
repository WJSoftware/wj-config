# wj-config

[![NPM](https://img.shields.io/npm/v/wj-config?style=plastic)](https://www.npmjs.com/package/wj-config)
![Latest Release](https://img.shields.io/github/v/release/WJSoftware/wj-config?include_prereleases&sort=semver&style=plastic)
![Lines of code](https://img.shields.io/tokei/lines/github/WJSoftware/wj-config?style=plastic&color=blueviolet)
![npm bundle size](https://img.shields.io/bundlephobia/min/wj-config?color=red&label=minified&style=plastic)

> JavaScript configuration module for **NodeJS** and **React** that works like ASP.net configuration where any number 
> of data sources are merged and environment variables can contribute/overwrite values by following a naming 
> convention.

Welcome to **wj-config**.  This JavaScript configuration library works everywhere, most likely.  The table below shows 
the frameworks or libraries that have successful samples in the [examples](https://github.com/WJSoftware/wj-config/tree/main/examples) folder in the left column.  The 
right column is pretty much anything else out there that looks like it supports **ES Modules**.

<table style="margin-left: auto; margin-right: auto">
    <thead>
        <tr>
            <th>Works With</th>
            <th>Probably Works With</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td valign="top">
                <img src="https://miro.medium.com/fit/c/192/192/1*APjYv_YDdw1J7WCT4uKh9Q.png" width="16px" height="16px" alt="JavaScript" />&nbsp;JavaScript<br />
                <img src="https://www.typescriptlang.org/favicon-32x32.png?v=8944a05a8b601855de116c8a56d3b3ae" width="16px" height="16px" alt="TypeScript" />&nbsp;TypeScript<br />
                <img src="https://nodejs.org/favicon.ico" width="16px" height="16px" alt="NodeJS" />&nbsp;NodeJS<br />
                <img src="https://deno.land/logo.svg" width="16px" height="16px" alt="Deno" />&nbsp;Deno<br />
                <img src="https://reactjs.org/favicon.ico" width="16px" height="16px" alt="ReactJS" />&nbsp;ReactJS<br />
                <img src="https://vuejs.org/logo.svg" width="16px" height="16px" alt="VueJS" />&nbsp;VueJS<br />
                <img src="https://svelte.dev/favicon.png" width="16px" height="16px" alt="Svelte" />&nbsp;Svelte
            </td>
            <td valign="top">
                <img src="https://solidjs.com/img/favicons/favicon-32x32.png" width="16px" height="16px" />&nbsp;SolidJS<br />
                <img src="https://preactjs.com/favicon.ico" width="16px" height="16px" alt="Preact" />&nbsp;Preact<br />
                <img src="https://electronjs.org/assets/img/favicon.ico" width="16px" height="16px" alt="Electron" />&nbsp;Electron<br />
                <img src="https://angular.io/assets/images/favicons/favicon-32x32.png" width="16px" height="16px" alt="Angular" />&nbsp;Angular<br />
                <img src="https://remix.run/favicon-32.png" width="16px" height="16px" alt="Remix" />&nbsp;Remix<br />
                <img src="https://emberjs.com/images/favicon.png" width="16px" height="16px" alt="EmberJS" />&nbsp;EmberJS<br />
                <img src="https://sennajs.com/images/favicon.ico" width="16px" height="16px" alt="SennaJS" />&nbsp;SennaJS<br />
                <img src="https://mithril.js.org/favicon.png" width="16px" height="16px" alt="MithrilJS" />&nbsp;MithrilJS<br />
                <img src="https://www.slingjs.org/wp-content/uploads/2021/08/sling-48x48.png" width="16px" height="16px" alt="SlingJS" />&nbsp;SlingJS<br />
                <img src="https://lit.dev/images/flame-favicon.svg" width="16px" height="16px" alt="Lit" />&nbsp;Lit<br />
            </td>
        </tr>
    </tbody>
</table>

Feel free to fork and pull request to include sample applications for your favorite library/framework.

## Important Notes

1. This package has been written in TypeScript and transpiled to ES modules.
2. Building the configuration object is an asynchronous operation, so [top level await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#top_level_await) is highly recommended.
3. The minimum supported **NodeJS** version is: ![NodeJS Minimum Version](https://img.shields.io/node/v/wj-config?style=social)

## Features

In a nutshell, this configuration package provides:

+ The ability to merge any number of data sources as one, just like ASP.net configuration loads files and memory 
dictionaries.
+ 6 pre-defined data sources:  JSON string, POJO object, single value, fetched data, dictionary, and environment.
+ Condition the inclusion of a data source based on a predicate function's return value.
+ Assign traits to the current environment and condition the inclusion of data sources based on the current 
environment's assigned traits.
+ The ability to create special functions from data that is meant to be used to construct URL's.  The created 
functions provide route replacement values, query string generation and URL encoding of replacement values.
+ An environment object with the current environment definition and helpful `isXXX()` functions to quickly create 
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
| VueJS | v2.0.0 | v3.2.45 | 3007 |
| Deno | v2.0.0 | v1.29.1 |

The repository contains the necessary `launch.json` file to run each of the examples in *Visual Studio Code*.

## Quickstart

1. Install the NPM package.
2. Create your JSON configuration files (quickstart will assume you want per-environment configuration).
3. Build your configuration object.

### 1. Install the NPM Package

```bat
npm install wj-config
```

### 2. Create your JSON Configuration Files

Create a JSON file to be your main configuration file and name it, say `config.json`.  For **React** you have two 
choices:

1. To include this file under the `/src` folder, in which case you later `import` it.
2. To include it in the `/public` folder, in which case you later `fetch` it.

For **NodeJS** you import or load using the `fs` module.

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

> **NOTE**: The `ws` section is special.  See [URL Configuration](#url-configuration) for the details.

Now write per-configuration JSON files.  Example for development (would be named `config.Development.json`):

```json
{
    "logging": {
        "minLevel": "debug"
    }
}
```

Yes, you only write the overrides, the values that change for the environment.  All other configuration is still 
available, but does not have to be repeated.

### 3. Build Your Configuration Object

Create a module of yours called `config.js` or whatever pleases you.  Obtain the environment name, load the 2 JSON 
files and build the configuration object.  This is in general.

There are two styles available:  The *classic* style leaves to you, the programmer, the responsibility of figuring out 
a way to select the correct per-environment data source.  The *conditional* style leaves the decision to the 
configuration builder.  Pick whichever pleases you, but know that the latter is safer.

From now on, any code samples that call the `loadJsonFile()` function are referring to this one:

```js
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
```

If you don't like it, feel free to write your own.

#### Classic Style

##### NodeJS ES Modules (Recommended)

```js
import wjConfig, { Environment } from 'wj-config';
import mainConfig from "./config.json" assert {type: 'json'}; // Importing data is a thing in NodeJS.

// Obtain an environment object ahead of time to help setting configuration up.
const env = new Environment(process.env.NODE_ENV);

const config = wjConfig()
    .addObject(mainConfig) // Main configuration JSON file.
    .name('Main') // Give data sources a meaningful name for value tracing purposes.
    .addObject(loadJsonFile(`./config.${env.current.name}.json`)) // The developer is deciding by using a file name tactic.
    .name(env.current.name)
    .addEnvironment(process.env) // Adds a data source that reads the environment variables in process.env.
    .includeEnvironment(env) // So the final configuration object has the environment property.
    .createUrlFunctions() // So the final configuration object will contain URL builder functions.
    .build(env.isDevelopment()); // Only trace configuration values in the Development environment.

// This is a top-level await:
export default await config; // The build() function is asynchronous, so await and export the result.
```

The calls to `addEnvironment()`, `includeEnvironment()` and `createUrlFunctions()` are not mandatory, they are just 
customary.  Typically, you also want to include the environment variables, have the `environment` object and also make 
use of [URL functions](#url-configuration).

##### NodeJS CommonJS Modules (If You Must)

```js
// Export the result of an IIFE, which will be a promise to return the configuration object.  This means that code in 
// need for the configuration object will have to execute inside async functions to be able to await, or wrap the 
// whole thing within a call to .then(), like in one of the examples provided in this project's repository.
// This is why CommonJS is discouraged.  It makes things more complex.
module.exports = (async function () {
    const { default: wjConfig, Environment } = await import('wj-config');
    const env = new Environment(process.env.NODE_ENV);
    return wjConfig()
        .addObject(loadJsonFile('./config.json', true))
        .name('Main')
        .addObject(loadJsonFile(`./config.${env.current.name}.json`))
        .name(env.current.name)
        .addEnvironment(process.env)
        .includeEnvironment(env)
        .createUrlFunctions()
        .build(env.isDevelopment());
})();
```

##### React

> **IMPORTANT**:  Eject or use the `@craco/craco` package (or similar one) and configure webpack to allow top-level 
> awaits.  Details in the [React section](#react-specific-notes).  It can also work without top-level awaits, but in 
> all honesty, I don't like it.

```js
import wjConfig, { Environment } from 'wj-config';
import mainConfig from './config.json'; // One may import data like this, or fetch it.

const env = new Environment(window.env.REACT_ENVIRONMENT);
const config = wjConfig()
    .addObject(mainConfig)
    .name('Main') // Give data sources a meaningful name for value tracing purposes.
    .addFetched(`/config.${env.current.name}.json`, false) // Fetch the JSON from the /public folder.
    .name(env.current.name)
    .addEnvironment(window.env, 'REACT_APP_') // Adds a data source that reads the environment variables in window.env.
    .includeEnvironment(env) // So the final configuration object has the environment property.
    .createUrlFunctions() // So the final configuration object will contain URL builder functions.
    .build(env.isDevelopment()); // Only trace configuration values in the Development environment.

export default await config;
```

---

Ok, now go ahead and consume your configuration object anywhere you need it.

### NodeJS ES Modules

```javascript
import config from './config.js';

console.log(config.app.title);
```

### NodeJS CommonJS Modules

```javascript
const configPromise = require('./config.js');

configPromise.then(config => {
    console.log(config.app.title);
});
```

### React

```javascript
import config from './config';

console.log(config.app.title);
```

### Conditional Style

> Since **v2.0.0**

There are two possible ways to do conditional style per-environment configuration.  The shortest first using the 
**React** sample:

```javascript
import wjConfig, { Environment } from 'wj-config';
import mainConfig from './config.json';

const env = new Environment(window.env.REACT_ENVIRONMENT);
const config = wjConfig()
    .addObject(mainConfig)
    .name('Main')
    .includeEnvironment(env)
    .addPerEnvironment((b, envName) => b.addFetched(`/config.${envName}.json`, false))
    .addEnvironment(window.env, 'REACT_APP_')
    .createUrlFunctions()
    .build(env.isDevelopment());

export default await config;
```

It looks almost identical to the classic.  This one has a few advantages:

1. Covers all possible environments.
2. Helps you avoid typos.
3. Makes sure there's at least one data source per defined environment.

**IMPORTANT**:  This conditional style requires the call to `includeEnvironment()` and to be made *before* calling 
`addPerEnvironment()`.  Make sure you define your environment names when creating the `Environment` object:

```javascript
const env = new Environment(window.env.REACT_ENVIRONMENT, ['myDev', 'myTest', 'myProd']);
```

This way `addPerEnvironment()` knows your environment names.

The longer way of the conditional style looks like this:

```javascript
import wjConfig, { Environment } from 'wj-config';
import mainConfig from './config.json';

const env = new Environment(window.env.REACT_ENVIRONMENT);
const config = wjConfig()
    .addObject(mainConfig)
    .name('Main')
    .addFetched(`/config.Development.json`, false)
    .forEnvironment('Development')
    .addFetched(`/config.PreProduction.json`, false)
    .forEnvironment('PreProduction')
    .addFetched(`/config.Production.json`, false)
    .forEnvironment('Production')
    .addEnvironment(window.env, 'REACT_APP_')
    .includeEnvironment(env)
    .createUrlFunctions()
    .build(env.isDevelopment());

export default await config;
```

This one has advantages 2 and 3 above, plus allows for the possiblity of having completely different data source types 
per environment.  95% of the time you'll need the short one only.

This works in **NodeJS** too.  There is a performance catch, though:  If in NodeJS you use `loadJsonFile()` with the 
`addObject()` data source function, you'll be reading all per-environment configuration files, even the unqualified 
ones.  To avoid this performance hit, pass a function to `addObject()` that, in turn, calls `loadJsonFile()`:

```js
import wjConfig, { Environment } from 'wj-config';
import mainConfig from "./config.json" assert {type: 'json'};

const env = new Environment(process.env.NODE_ENV);

const config = wjConfig()
    .addObject(mainConfig)
    .name('Main')
    .includeEnvironment(env)
    // Using a function that calls loadJsonFile() instead of calling loadJsonFile directly.
    .addPerEnvironment((b, envName) => b.addObject(() => loadJsonFile(`./config.${envName}.json`)))
    .addEnvironment(process.env)
    .createUrlFunctions()
    .build(env.isDevelopment());

export default await config;
```

Now you know how to do per-environment configuration in the *classic* and *conditional* styles.  Pick your poison.

## URL Configuration

> Since **v1.0.0**

As mentioned above, this package has a special feature:  It creates functions for configured URL's.  But what does 
this mean?  Let's review the [Quickstart](#quickstart) example JSON.

Not explained before, but the example JSON given in [Quickstart](#quickstart) intends to define the following 3 URL's:

1. /api/v1/login
2. /api/v1/cat
3. /api/v1/cat/{catId}

All were defined as relative URL's, but absolute URL's can also be built by providing, as a minimum, the `host` 
property.

### Mechanism

The URL mechanism built in this library aims towards minimizing the amount of data typed, which in turn allows for 
easy per-environment (or per-anything, really) overrides.  For example, one host specification can be made to apply to 
all the 3 configured URL's above.  You can probably guess that this is also true for common pieces of paths, specified 
in the `rootPath` properties.  Yes, properties in plural form.  Each level may provide a new root path that is 
appended to all previous root paths.  It so stands that if the host needs to be overridden for a specific environment, 
it is just as easy as overriding it once in an environment-specific data source (such as a JSON file).

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
part of the URL's path and not the query string, modifying it to `/api/v1/users/{id}?format={format}` and your 
function call does not have to change at all!  Your code does not care about the position of replaceable route values.

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
    .createUrlFunctions(null, /\:([a-zA-z]\w*)/)
    .build();
```

As you probably infer by the comment in the sample code, the regular expression is applied to the fully constructed 
url, so be sure not to match the port specification itself.

### Dynamic Query Strings

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
const singleCatalogueUrl = config.ws.gateway.catalogue.single(n => catalogueId, () => ({ format: 'full' }));
console.log(singleCatalogueUrl); // Shows /api/v1/cat/123?format=full for all the presented variants above.
```

You may also mix this method with statically-added query strings in the config JSON/data sources.  For example, you 
could define the following JSON and also apply more query string pairs with the above methods:

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

You may also create fully dynamic URL's with the same mechanism.

Every non-leaf object (node) in a web services path in your configuration is granted the `buildUrl()` function that 
works exactly the same as the leaf functions but also accepts a path.  Referring to the same configuration example as 
before, we have the following `buildUrl()` functions for immediate use:

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

```javascript
config.ws.gateway.login(); // https://localhost:1122/api/v1/login
config.ws.gateway.catalogue.getAll(); // https://localhost:1122/api/v1/cat
config.ws.gateway.catalogue.single(); // https://localhost:1122/api/v1/cat/{catId}
config.ws.gwSockets.support.chat(); // wss://localhost:1122/ws/support/chat?userId={userId}
```

**IMPORTANT**:  The `host`, `port` and `scheme` values cannot be changed down the hierarchy once set, and this is why 
a new sub hierarchy is created for the web socket URL's.

### A Note on What "Leaf" Properties Are

> Since **v1.0.0**

Before version 2, a property was a leaf property subject to conversion to a URL-building function if it had a parent 
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

##  Environment Object

> Since **v1.0.0**

The configuration object is granted an `environment` property whose value is an object with a `value` property, a 
`names` property that contains the list of defined environments and as many `isXXX()` functions as there are 
environment names.  Assuming the names on the default configuration, the object will have `isDevelopment()`, 
`isPreProduction()` and `isProduction()`.

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
the configuration object is created, it comes in the `environment` property inside the built configuration object and 
it is therefore a futile exercise to create it separately.

> Since **v2.0.0**

In version 2 onwards, the environment object is not added by default, and a call to the builder's `includeEnvironment()` 
function must be added in order to include this property.

Furthermore, the `value` and `names` properties have disappeared.  See the next sub section for details.

### Environment Definition Objects

>  Since **v2.0.0**

Starting with v2, the current environment is not only a name:  It is an object with two properties:  `name` and 
`traits`.

This object is represented by the TypeScript type called `IEnvironmentDefinition`.  This is a new feature that allows 
developers to define the current environment by assigning characteristics or traits, and then condition data sources 
based on said traits.

So long story short:  The environment object now looks like this:

```js
{
    current: { name: 'Development', traits: 0 },
    all: ['Development', 'PreProduction', 'Production'],
    isDevelopment: function() { ... },
    isPreProduction: function() { ... },
    isProduction: function() { ... }
}
```

The `current` property has taken over the old `value` property; the `all` property has taken over the `names` property.

But let's see about this completely new way of building a configuration object in the next section.

## Alternative Configuration Mechanism:  Per-Trait Configuration

If you have the need to create multiple variants of an environment's configuration because, for example, you need to 
create different configuration files per tenant, or per region, then you are in luck with **wj-config**.  Now you can 
apply configuration data sources based on traits defined for the current environment and combine this technique with 
the "traditional" way of having per-environment overrides to avoid having to make these "combinations" yourself.

Let's imagine we have to set a few configuration values differently depending on the region of the world the 
application is deployed to.

This would be the default values found in the main configuration (region-independent) file:

```json
{
    "appSettings": {
        ...
        "regionCode": "UNK",
        "regionName": "Unknown"
    },
    ...
}
```

The need:  Apply different values for `regionCode` and `regionName` in one or more environments depending on the 
region the application is deployed to.  Simple.  Let's create more JSON files, but this time they will be per-region 
files, not per-environment files.

For `AMR`, `config.amr.json`:

```json
{
    "appSettings": {
        "regionCode": "AMR",
        "regionName": "Americas"
    }
}
```

For `EUR`, `config.eur.json`:

```json
{
    "appSettings": {
        "regionCode": "EUR",
        "regionName": "Europe"
    }
}
```

For `ASA`, `config.asa.json`:

```json
{
    "appSettings": {
        "regionCode": "ASA",
        "regionName": "Asia"
    }
}
```

Now the trick:  We will add those files as configuration data sources (either fetched or read from disk or imported) 
and then apply a conditional based on environment traits.

Before we do this, let's understand how traits are defined in code.

### Traits

Traits are values that represent a characteristic of the application.  It can be represented in JavaScript using 
either a number or a string.  The most practical approach is using an enumeration.

If you use a numeric enumeration, it is expected that a set of traits will be a single **bitmasked value**.
Therefore, it is expected that individual traits be defined as individual bits.

If you decide to use strings, then a set of traits would have to be defined by using an array of strings.  You can 
then infer that individual traits are defined by individual strings.

**NOTE:**  It is highly recommended, though, that you use **numeric** enumerations because they are simpler to work 
with.

To continue working in the example about per-region configurations, this would be the region traits that we would 
define:

```javascript
export default Object.freeze({
    None: 0x0, // No bits lit:  0000 0000
    Americas: 0x1, // Least significant bit: 0000 0001
    Europe: 0x2, // Next bit: 0000 0010
    Asia: 0x4 // Next bit: 0000 0100
})
```

Generally speaking, with a numeric trait definition, you would calculate the total traits an environment would have by 
using the bitwise OR binary operator (`|`):

```javascript
const envTraits = myTraits.Americas | myTraits.Europe;
```

The above variable, `envTraits`, would have the numeric value of 3, which is represented in binary as `0000 0011`, 
which is the least significant bit and the next to that bit.  That corresponds to `Americas` and `Europe`.

Agreed, though:  For the per-region example this combination would not make sense so forget I even mentioned it.

---

Ok, back to our per-region example, and now with the traits defined, let's create the configuration object.

```javascript
import wjConfig, { Environment, EnvironmentDefinition } from "wj-config";
import myTraits from './myTraits.js';

// Easiest to show with NodeJS as we already have an environment object with all variables ready.
// The ENV_TRAITS environment variable would contain the desired trait value assigned when deploying.

// We use the parseInt() function to tell wj-config our traits are NUMERIC.
const currentEnvDef = new EnvironmentDefinition(process.env.NODE_ENV, parseInt(process.env.ENV_TRAITS));
const env = new Environment(currentEnvDef, ['MyList', 'OfPossible', 'Environments']);
// Main configuration file.  Boolean argument defines if the file must exist.
const mainConfig = loadJsonFile('./config.json', true);
export default await wjConfig()
    .addObject(mainConfig)
    .name('Main')
    .includeEnvironment(env)
    // Classic or coditional per-environment config.  Conditional shown here.
    .addPerEnvironment((b, envName) => b.addObject(() => loadJsonFile(`./config.${envName}.json`, false)))
    .addObject(() => loadJsonFile('config.amr.json', false))
    .whenAllTraits(myTraits.Americas, 'Americas') // <-- It conditions the recently added data source.
    .addObject(() => loadJsonFile('config.eur.json', false))
    .whenAllTraits(myTraits.Europe, 'Europe')
    .addObject(() => loadJsonFile('config.asa.json', false))
    .whenAllTraits(myTraits.Asia, 'Asia')
    .build();
```

#### A NOTE FOR REACT

`parseInt()` is not needed if your `window.env.REACT_ENV_TRAITS` property has a number directly assinged, like this:

```javascript
window.env = {
    REACT_ENVIRONMENT: 'MyDev',
    REACT_ENV_TRATIS: 5 // <--- Traits 0x1 and 0x4.
};
```

---

With the above, the configuration object will discard any per-region configurations if the trait specification 
for the current environment (given by the value of the `ENV_TRAITS` environment variable) does not contain the 
corresponding per-region trait.  The code does not have to be modified in any way or form when deploying to the 
different regions.  All that needs to change is the value of the `ENV_TRAITS` environment variable during deployment 
or server/pod configuration so it reflects the correct trait combination.

Furthermore, we did not have to create duplicates of per-environment configuration files to create combinations with 
each of the per-region settings.  The combinations are left in the hands of the configuration builder at runtime.

This applies to any possible environment, without any change, as seen above.  This is the power and convenience of 
using environment traits.

**WARNING**:  The `whenAllTraits()` and `whenAnyTrait()` functions are used, the builder will emit an error if there 
was no call to `includeEnvironment()` because it is a known fact that the environment object is needed for the trait 
conditionals to work.  So make sure to include this call whenever you work with per-trait configuration.

## Conditionally Include Data Sources

> Since **v2.0.0**

This is a new feature that came to be to support **per-trait configuration**, as explained in the previous section.

Any data source can be selectively included in runtime by using the special builder function `when()`.

The `when()` function accepts a *function that receives the current environment object, and is meant to return a 
`Boolean` value*.  If the returned value is `true`, the associated data source is included; if the returned value is 
`false` then the associated data source is excluded and therefore won't participate in the creation of the final 
configuration object.

The following is an example for **React** that includes a fetched data source based on the browser being used.

```javascript
import wjConfig, { Environment } from "wj-config";
import mainConfig from './config.json';

// Chromium-based browsers.
var isChromium = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

export default await wjConfig()
    .addObject(mainConfig)
    .name('Main')
    .addFetched('/config.chromium.json')
    .when(e => isChromium, 'Chromium')
    .build();
```

And this one is one for **NodeJS** that includes a configuration data source only if the standard output has not been 
redirected.

```javascript
import wjConfig, { Environment } from "wj-config";
import mainConfig from './config.json' assert { type: 'json' };

export default await wjConfig()
    .addObject(mainConfig)
    .name('Main')
    .addObject(() => loadJsonFile('config.TTY.json'))
    .when(e => process.stdout.isTTY)
    .build();
```

It is not required to create a conditional that actually uses the provided environment object.  This is why the use of 
`when()` doesn't fail if the `includeEnvironment()` call is not included as a building step.  Just note that the value 
of the `e` parameter inside the conditional function will be `undefined`.  If you need the environment, better to call 
`includeEnvironment()`.

Also seen in the **React** example is the presence of a second argument passed to `when()`:  It merely sets the data 
source's name.  `.when(e => isChromium, 'Chromium')` is equivalent to `.when(e => isChromium).name('Chromium')`.

### The forEnvironment Function Explained

As seen in the conditional style section of the [Quickstart](#conditional-style), there is this function called 
`forEnvironment()` that makes the per-configuration task wordier, but clearer.  It is also mentioned that it 
provides advantages over the *classic* way of doing per-environment configuration overrides.  Let's talk about those.

#### Standardized Data Source Naming

Regardless of the type of data source being conditionally applied, its name is set to this convenient name format: 
`{Environment} (environment-specific)`.  Example:  `Production (environment-specific)`.

It is possible to use `forEnvironment()` more than once for a given environment.  When this happens, the label 
assigned to the first data source will be of the form `{Environment} (environment-specific)` for the first one, and 
then it will be of the form `{Environment} #{Count} (environment-specific)` for all subsequent ones.  Example: 
`Production #2 (environment-specific)`

Of course, if you don't like this naming convention, you can still use `forEnvironment()`'s second parameter to set 
any name you want.

#### The Builder Knows Environment Is Needed

This is a great advantage.  By using the `forEnvironment()` function, the configuration builder knows the environment 
object will be needed and can therefore raise an error if the `includeEnvironment()` function is not used.

#### The Builder Checks For Enviroment Coverage

This advantage can be disabled but is active by default:  The builder assumes you must have at least one configuration 
data source per defined environment and is able to enforce this by throwing an error if not all possible environments 
have been assigned at least one data source.

Yes, it is possible to cover other environments in a different way, and this is why the `build()` function now has a 
second optional Boolean parameter called `enforcePerEnvironmentCoverage`.  Set this one to `false` to disable this 
check.

## React-Specific Notes

A React application is a collection of static content.  All of the Javascript in the `/src` folder is bundled and 
minified when `npm run build` is executed.  Furthermore, the `.env` configuration system is also applied, replacing 
every **process.env.REACT_APP_XXX** instance with its configured value (read more @ 
[Create React App web](https://create-react-app.dev/docs/adding-custom-environment-variables/)).

Because the `.env` configuration system is so simple, it is quite a challenge to configure dozens or hundreds of 
values using this system, which is commonly the case, especially in microservices/micro frontends.

This configuration system comes to replace the `.env` system completely.  At least one value, however, must be set 
outside this system, and that value is the environment name.  The other value, if needed because you would be doing 
per-trait configuration, is the **environment traits** (since **v2.0.0**).

Because of my experience with micro frontends, my recommendation is to create a `env.js` file in the `/public` 
React folder whose contents will be the following:

```js
window.env = {
    REACT_ENVIRONMENT: 'Development',
    REACT_ENV_TRAITS: 3 // New in v2.0.0.  Define the environment traits.
};
```

This JS file needs to be added to the index page using a script tag:

```html
<script src="%PUBLIC_URL%/env.js" type="text/javascript"></script>
```

(Please pardon my HTML if it is somehow incorrect.  Hopefully you get the idea.)

Now, when deploying, deploy a version of this `env.js` that has the correct environment name.  Especifically with 
Rancher/Kubernetes, this can be done easily by creating a **ConfigMap** and mounting said **ConfigMap** in the file 
system.  Finally use a bash script as entry point in the Docker image to overwrite `/public/env.js` with the 
contents of the mounted volume and then start your HTTP server (could be NGINX or any other).

An alternative method is to configure environment variables in the Pod (or the Docker image using the `ENV` 
instruction) and then having a script import the relevant environment variables from the OS into the JavaScript file, 
and for this specific purpose, this project has the 
[deployment folder](https://github.com/WJSoftware/wj-config/tree/main/deployment).  In it you can find a script that 
does exactly this.

**WORD OF CAUTION**:  Using a Pod template in Kubernetes is usually better than using the Dockerfile's `ENV` 
instruction because then the image is not tied to a specific environment.

This last alternative may be better than **ConfigMap**'s because it enables the use of Kubernetes **Secrets**.

### How to Use Top-Level Await in React

All major browsers now support the top-level await feature as seen in the [can I use website](https://caniuse.com/?search=top%20level%20await).

The problem is that current React applications created with **Create React App** do not enable this feature for its 
webpack configuration, (and this may change in the future, so be on the lookout).

There are two possible solutions that I know of:

1. Eject.  That's right.  Simply run `npm eject` so the webpack configuration is readily available for modification.
2. Install `@craco/craco` from the [NPM global repository](https://www.npmjs.com/package/@craco/craco).  For modern 
React applications using `react-scripts` package v5.x install [version 7](https://www.npmjs.com/package/@craco/craco/v/7.0.0) 
or greater.

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

> Since **v2.0.0**

Since v2, the environment data source is not automatically added and must be added using the builder's 
`addEnvironment()` function.

### The Environment Variable Name Explained

For an environment variable to successfully contribute to the configuration, its name must comply with 2 rules:

1. Start with the configured prefix.  The desired prefix is passed when calling the builder's `addEnvironment()` 
function.  If none specified, the default is `OPT_`.
2. Double underscores (__) separate the hierarchy levels until the leaf property is reached.

In the example above, the environment variable's name starts with `OPT_`, the default prefix.  It then specifies the 
first hierarchy name, `myRemoteSystem`, and finally ends with the leaf property name, `password`.  Note that deeper 
hierarchies can be specified by adding more hierarchy names separated by double underscores before the leaf property 
name.

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
| `FetchedDataSource` | `addFetched()` | Fetches data using `fetch()` and adds its result as configuration source.  The result of the call must of course be a JSON object. |
| `JsonDataSource` | `addJson()` | Adds the provided JSON string as source of configuration data.  The advantage here is that the JSON parser can be specified.  It could be the famous `JSON5` parser, for example.|
| `ObjectDataSource` | `addObject()` | Adds the specified object as source of configuration data. |
| `SingleValueDataSource` | `addSingleValue()` | Adds the specified key and value as source of configuration data.  Useful to import automatically created values from CI/CD or similar. |

### Creating New Data Sources

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
include in the final configuration object.  It must return the object itself with the desired hierarchy in place.  The 
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

Some data sources like the `ObjectDataSource` provide by default a generic name that is the same for all instances, 
making it impossible to distinguish in a trace between two of these.  This is where the builder's `name()` function 
comes in handy.  Use it to set meaningful names to data sources so it is easy to understand data traces.

### Qualified Data Sources

> Since **v2.0.0**

Starting with v2, it is possible to conditionally include data sources at runtime.  Tracing also adds the 
`_qualifiedDs` property to the resulting configuration object.  It consists of an array of `IDataSourceInfo` objects 
of all data sources that qualified (its conditional function returned `true`), or that had no conditional attached to 
them.  Only the data sources in this array will have contributed to the final shape of the configuration object.

## Advantages of v2.0.0

The following is a list of improvements over the v1 versions and should be compelling reasons for upgrading.

1. The developer can easily enforce an order of priority for the various possible configuration sources.
2. Configuration sources are no longer required; easily can `wj-config` be set to work with say, just environment 
variables.
3. Any arbitrary number of data sources can be provided, not just 1 or 2 as in v1.
4. New packages can be created that extend the list of sources.
5. No global default options.  Each option that requires a default is handled by its corresponding function in the 
builder.  It is much simpler to understand and remember.
6. Adds the possibility of other file formats as source of configuration, which could be generated by CI/CD.
7. The `environment` object is optional, freeing this name for custom use, if desired.
8. The `environment` object, if included, can be stored in the optionally provided property name, also freeing the 
name `environment` for custom use.
9. URL function creation is optional, not wasting processor time if none are needed or desired, crazy as that sounds.
10. If an environment object is created ahead of time, it can be given to the builder in order to preserve a bit more 
of that processing power.
11. The URL building functions now URL-encode all values.
12. The URL building functions now accept a query string-specific argument for dynamic query string building, 
something not found at all in v1.
13. Debug your configuration easily:  Every value in the final configuration object can be traced to its data source.
14. Because data sources work asynchronously, fetching configuration data from a server is an option now.
15. Data sources can now be conditioned to leave the final decision to runtime.
16. Environments can be defined by a set of traits and then configuration data sources can be sectioned in a per-trait 
basis, enabling a new and completely different approach to building configurations.
17. By doing per-environment configuration with the *conditional* style, the configuration builder can validate that 
there is at least one data source per defined environment name, giving the developer the confidence that all 
environments are covered.
