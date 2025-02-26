# wj-config

[![NPM](https://img.shields.io/npm/v/wj-config?style=plastic)](https://www.npmjs.com/package/wj-config)
![Latest Release](https://img.shields.io/github/v/release/WJSoftware/wj-config?include_prereleases&sort=semver&style=plastic)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/WJSoftware/wj-config?style=plastic&color=violet)
![npm bundle size](https://img.shields.io/bundlephobia/min/wj-config?color=red&label=minified&style=plastic)

> JavaScript configuration module for **NodeJS** and **browser frameworks** that works like ASP.net configuration 
> where any number of data sources are merged, and environment variables can contribute/overwrite values by following a 
> naming convention.

> [!IMPORTANT]
> ## v3.0.0
> 
> Version 3.0.0 is a full re-write on the TypeScript side of the package.  Its Intellisense is now fully accurate for 
> almost everything and anything.  Read all about it in [the TypeScript Wiki page](https://github.com/WJSoftware/wj-config/wiki/English__Theory__TypeScript-and-wj-config).

This JavaScript configuration library works everywhere, most likely.  The table below shows the frameworks or libraries 
that have successful samples in the [examples](https://github.com/WJSoftware/wj-config/tree/main/examples) folder in the 
left column.  The right column is pretty much anything else out there that looks like it supports **ES Modules**.

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
                <img src="https://deno.com/logo.svg" width="16px" height="16px" alt="Deno" />&nbsp;Deno<br />
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
                <img src="https://emberjs.com/favicons/icon.svg" width="16px" height="16px" alt="EmberJS" />&nbsp;EmberJS<br />
                <img src="https://sennajs.com/images/favicon.ico" width="16px" height="16px" alt="SennaJS" />&nbsp;SennaJS<br />
                <img src="https://mithril.js.org/favicon.png" width="16px" height="16px" alt="MithrilJS" />&nbsp;MithrilJS<br />
                <img src="https://www.slingjs.org/wp-content/uploads/2021/08/sling-48x48.png" width="16px" height="16px" alt="SlingJS" />&nbsp;SlingJS<br />
                <img src="https://lit.dev/images/flame-favicon.svg" width="16px" height="16px" alt="Lit" />&nbsp;Lit<br />
                <img src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAI2AAACNgElQaYmAAACc0lEQVQ4jaVTXUiTURh+zlxrW21u7mtz6pa//alpXkgRiIGYZWA3XkRBdlMGQQZ1kd0EBVJdqDdZF0kRRRdCNwkFmlZCWhQMI2NDncvAOW1+c5vO7fve+E5taBhd+MID57w/z3PO+57DiAgbMdV6tYyx6pLi3W+KCgtC+bnOScZY07801pyAMZZrz7Q9rqjYV3n+TKMm22pAYF7Ek56XYu+r1965+WALEQ2uS5CTndUuSXLzowd31flZBrWUiEOr1/OYLEn4GYrh9NlL/inf9PNwJHqViBZ4UCHIMJt7Tp08EU8sTpN//APNeT+R98sABb+7UogvTHLcutG6pNNpfQBMSfHj9UfrYkpxMul/uNLSLOp0WrdCwATB4hsZ6nc4M9M525hnEm63Bw31tal7rufL2VEp+mcD11VOR47BaTenAr19w7h5pwuu0a98vyCGuO/ytbaUT7FjtYcYgAuqaCQSAcm/O7qYgG2ZsLcgD2Wle7jPlG6EVZuGqpIylNsL8adxEMzpGgAFTLCYfWOfBx1KokLAfsRAwibU1ByGUQKWpQQ6uu9hpyUPZEwD2TZDXo6h9GDdinvcq1HNzQe7b7d3iZzYoIa8awtI0GCr0QCdWoUoA4r2F0Mu0vNikiQMDLyDuBgOA3DxMer1Os/9zrbo390PTLnW7GOzbhrufUYWs2lJ0QPQxAkAbLdtE2YbG46E3R/7aSXgoXhwgkNZx2a+0czoELVePCfZM62KslL0kI8x+RgYYyYAL6xCRrkjO0tVU3VA6TK3vrfv5QmvLy0ohqIAlJF1ElFL6iWuBoBqAE8BJJWS8ALoAJC7On9j3xnAL9flh6V7H5YQAAAAAElFTkSuQmCC" width="16px" height="16px" alt="Bun" />&nbsp;Bun<br />
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
| Svelte | v2.0.0 | v3.54.0 | 3008 |

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

Create a JSON file to be your main configuration file and name it, say `config.json`.  For **web projects** you have 
two choices:

1. Include this file under the `/src` folder, in which case you later `import` it.
2. Include it in the `/public` or `/static` folder, in which case you later `fetch` it.

For **NodeJS** you import or load using the `fs` module.

Example configuration JSON:

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

> **NOTE**: The `ws` section is special.  See [URL-Building Functions](https://github.com/WJSoftware/wj-config/wiki/English__Theory__URL-Building-Functions)
> in the **Wiki** for the details.

Now write per-environment JSON files.  Example for development (would be named `config.Development.json`):

```json
{
    "logging": {
        "minLevel": "debug"
    }
}
```

Yes, you only write the overrides, the values that change for the environment.  All other configuration values will also 
be available, but is not necessary to repeat them:  DRY configuration.

### 3. Build Your Configuration Object

Create a module of yours called `config.js` or whatever pleases you.  Obtain the environment name, load the 2 JSON 
files and build the configuration object.  This is generally speaking.

There are two styles available:  The *classic* style leaves to you, the programmer, the responsibility of figuring out 
a way to select the correct per-environment data source.  The *conditional* style leaves the decision to the 
configuration builder.  Pick whichever pleases you, but know that the latter is safer.

From now on, any code samples that call the `loadJsonFile()` function are referring to this function:

```js
function loadJsonFile(fileName, isRequired) {
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

If you don't like it, feel free to write your own.  I wrote this before I knew of the existence of the `fs/promises` 
module.  If you write one yourself using async `fs`, please pull request and share the love. 😁😎

#### Classic Style

##### NodeJS ES Modules (Recommended)

```js
import wjConfig, { buildEnvironment } from 'wj-config';
import mainConfig from "./config.json" assert {type: 'json'}; // Importing data is a thing in NodeJS.

// Obtain an environment object ahead of time to help setting configuration up.
const env = buildEnvironment(process.env.NODE_ENV /*, ['my', 'own', 'environment', 'list'] */);

const configPromise = wjConfig()
    .addObject(mainConfig) // Main configuration JSON file.
    .name('Main') // Give data sources a meaningful name for value tracing purposes.
    .addObject(loadJsonFile(`./config.${env.current.name}.json`)) // The developer is deciding by using a file name tactic.
    .name(env.current.name)
    .addEnvironment(process.env) // Adds a data source that reads the environment variables in process.env.
    .includeEnvironment(env) // So the final configuration object has the environment property.
    .createUrlFunctions('ws') // So the final configuration object will contain URL builder functions.
    .build(env.isDevelopment()); // Only trace configuration values in the Development environment.

// This is a top-level await:
export default await configPromise; // The build() function is asynchronous, so await its promise and export the result.
```

The calls to `addEnvironment()`, `includeEnvironment()` and `createUrlFunctions()` are not mandatory, they are just 
customary.  Typically, you also want to include the environment variables, have the `environment` object and also make 
use of [URL-Building Functions](https://github.com/WJSoftware/wj-config/wiki/English__Theory__URL-Building-Functions).

##### NodeJS CommonJS Modules (If You Must)

```js
// Export the result of an IIFE, which will be a promise to return the configuration object.  This means that code in 
// need for the configuration object will have to execute inside async functions to be able to await, or wrap the 
// whole thing within a call to .then(), like in one of the examples provided in this project's repository.
// This is why CommonJS is discouraged.  It makes things more complex.
module.exports = (async function () {
    const { default: wjConfig, buildEnvironment } = await import('wj-config');
    const env = buildEnvironment(process.env.NODE_ENV /*, ['my', 'own', 'environment', 'list'] */);
    return wjConfig()
        .addObject(loadJsonFile('./config.json', true))
        .name('Main')
        .addObject(loadJsonFile(`./config.${env.current.name}.json`))
        .name(env.current.name)
        .addEnvironment(process.env)
        .includeEnvironment(env)
        .createUrlFunctions('ws')
        .build(env.isDevelopment());
})();
```

##### Web Projects

> **IMPORTANT**:  If your project is a React project created with *Create React App*, the recommendation is to eject 
> or use the `@craco/craco` package (or similar one) in order to configure webpack to allow top-level awaits.  You 
> can read the details in the [Top Level Await](https://github.com/WJSoftware/wj-config/wiki/English__JavaScript-Concepts__Top-Level-Await) 
> section in the **Wiki**.  It can also work without top-level awaits, but in all honesty, I don't like it.  The 
> **Wiki** also explains how to achieve this for Vite projects (Vue, Svelte, React, etc.).

```js
import wjConfig, { buildEnvironment } from 'wj-config';
import mainConfig from './config.json'; // One may import data like this, or fetch it.

const env = buildEnvironment(window.env.REACT_ENVIRONMENT /*, ['my', 'own', 'environment', 'list'] */);
const configPromise = wjConfig()
    .addObject(mainConfig)
    .name('Main') // Give data sources a meaningful name for value tracing purposes.
    .addFetched(`/config.${env.current.name}.json`, false) // Fetch the JSON from the /public folder.
    .name(env.current.name)
    .addEnvironment(window.env, 'REACT_APP_') // Adds a data source that reads the environment variables in window.env.
    .includeEnvironment(env) // So the final configuration object has the environment property.
    .createUrlFunctions('ws') // So the final configuration object will contain URL builder functions.
    .build(env.isDevelopment()); // Only trace configuration values in the Development environment.

export default await configPromise;
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

### Web Projects

```javascript
import config from './config';

console.log(config.app.title);
```

### Conditional Style

> Since **v2.0.0**

There are two possible ways to do conditional style per-environment configuration.  The shortest first using the 
**Web Projects** sample:

```javascript
import wjConfig, { buildEnvironment } from 'wj-config';
import mainConfig from './config.json';

const env = buildEnvironment(window.env.REACT_ENVIRONMENT /*, ['my', 'own', 'environment', 'list'] */);
const config = wjConfig()
    .addObject(mainConfig)
    .name('Main')
    .includeEnvironment(env)
    .addPerEnvironment((b, envName) => b.addFetched(`/config.${envName}.json`, false))
    .addEnvironment(window.env, 'REACT_APP_')
    .createUrlFunctions('ws')
    .build(env.isDevelopment());

export default await config;
```

It looks almost identical to the classic.  This one has a few advantages:

1. Covers all possible environments.
2. Helps you avoid typos.
3. Makes sure there's at least one data source per defined environment.

**IMPORTANT**:  This conditional style requires the call to `includeEnvironment()` and to be made *before* calling 
`addPerEnvironment()`.  Make sure you define your environment names when creating the environment object:

```javascript
const env = buildEnvironment(window.env.REACT_ENVIRONMENT, ['myDev', 'myTest', 'myProd']);
```

This way `addPerEnvironment()` knows your environment names.

The longer way of the conditional style looks like this:

```javascript
import wjConfig, { buildEnvironment } from 'wj-config';
import mainConfig from './config.json';

const env = buildEnvironment(window.env.REACT_ENVIRONMENT);
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
    .createUrlFunctions('ws')
    .build(env.isDevelopment());

export default await config;
```

> When not specified, the list of environments is `'Development'`, `'PreProduction'`, and `'Production'`.

This one has advantages 2 and 3 above, plus allows for the possiblity of having completely different data source types 
per environment.  Furthermore, this allows you to add more environment-specific data sources if, for example, a 
particular environment requires 2 or more data sources.  95% of the time you'll need the short one only.

> **NOTE**:  This "long" version can be mixed with the "short" version, if you so desire.

This works in **NodeJS** too.  There is a performance catch, though:  If in NodeJS you use `loadJsonFile()` with the 
`addObject()` data source function, you'll be reading all per-environment configuration files, even the unqualified 
ones.  To avoid this performance hit, pass a function to `addObject()` that, in turn, calls `loadJsonFile()`:

```js
import wjConfig, { buildEnvironment } from 'wj-config';
import mainConfig from "./config.json" assert {type: 'json'};

const env = buildEnvironment(process.env.NODE_ENV);

const config = wjConfig()
    .addObject(mainConfig)
    .name('Main')
    .includeEnvironment(env)
    // Using a function that calls loadJsonFile() instead of calling loadJsonFile directly.
    .addPerEnvironment((b, envName) => b.addObject(() => loadJsonFile(`./config.${envName}.json`)))
    .addEnvironment(process.env)
    .createUrlFunctions('ws')
    .build(env.isDevelopment());

export default await config;
```

Now you know how to do per-environment configuration in the *classic* and *conditional* styles.  Pick your poison.

## Documentation

This README was already too long, so all documentation has been re-written and placed in this repository's 
[wiki](https://github.com/WJSoftware/wj-config/wiki).  It is in English only for now.

Be sure to stop by because this not-so-quick start tutorial only scratched the surface of what is possible with 
**wj-config**.

Enjoy!
