# wj-config v2.0.0 Example - VueJS

This is an example built for `wj-config` v2.0.0.  It was created using `npm create vite@latest` with the `Vue` 
framework and the `TypeScript` variant.  This created the application with **Vue** v3.2.45.

## Running in Visual Studio Code

As a first step, make sure you run `npm i` or `npm ci` in the example's folder to install all package dependencies.

This repository contains the `launch.json` file Visual Studio Code requires already configured.  Simply run the 
configuration named **Launch VueJS Example v3.2.45 - v2.0.0**.

This configuration has a pre-launch task that takes care of starting the NPM server (the `npm run dev` command), so no 
need to run this yourself.

## Environment Variables in VueJS with WJ-Config

> This is an opinionated way to achieve environment variables in **VueJS**.  There are more ways and you are invited 
> to explore any other ways you wish.  Surely there will be other methods of doing this.

The `wj-config` configuration package should largely eliminate the need for environment variables.  However, if the 
need for environment variables arise, then you may proceed as shown in this example:  Create the `public/env.js` file 
and import it using a script tag in your index page.  This file defines the `window.env` object.  Add "environment" 
variables to this object following the environment variable name convention if you wish for `wj-config` to use them as 
a data source.

As explained by the package's README, you need to specify two values outside the realm of `wj-config` somewhere.  You 
can use `window.env` to transmit the environment name and the environment traits.  This is done in this example.

---

# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.
