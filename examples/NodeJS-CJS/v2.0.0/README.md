# wj-config v2.0.0 Example - NodeJS ES Modules

This is an example built for `wj-config` v2.0.0.  It was written using **ES Modules** while testing in in NodeJS 
**v18.1.0**.

## Running in Visual Studio Code

As a first step, make sure you run `npm i` or `npm ci` in the example's folder to install all package dependencies.

This repository contains the `launch.json` file Visual Studio Code requires already configured.  Simply run the 
configuration named **Launch NodeJS MJS Example v18.1.0 - v2.0.0**.

## Between ES Modules and CommonJS Modules...

This example does exactly the same as the console sample written in **ES Modules**.  Go ahead and compare both code 
bases.  You'll conclude that the superior way is **ES Modules**.  While you are free to continue using whichever you 
desire, I urge you to join me in a movement to normalize using **ES Modules** for server-sided code.

## What is Showcased

1. Outputs all of the configuration object's first level properties in tables (some may be wide, so 4K resolution is 
recommended).
2. Uses the **structured-log** NPM package to demonstrate how the minimum logging level can be manipulated through 
configuration data source overrides.
3. Does some fetching of data using the **URL functions** that **wj-config** creates and outputs statistics about the 
obtained data.
4. Uses conditional configuration to add a non-TTY output-only data source that enables the output of all fetched 
data.  This means that fetched data is outputted only if the console output is redirected, for example, when using the 
`> output.txt` command in the console.
5. Uses per-trait configuration to narrow the selection of some computer ASCII art that is displayed at the very 
beginning of the application.
