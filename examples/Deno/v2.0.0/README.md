# wj-config v2.0.0 Example - Deno

This is an example built for `wj-config` v2.0.0.  It was written using **ES Modules** while testing in in Deno 
**v1.29.1**.

## Running in Visual Studio Code

**Make sure you have installed Deno.**

This repository contains the `launch.json` file Visual Studio Code requires already configured.  Simply run the 
configuration named **Launch Deno Example v1.29.1 - v2.0.0**.

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
