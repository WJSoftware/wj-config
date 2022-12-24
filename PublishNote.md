> First Release Candiate!
> See complete examples [in the Version_2 branch](https://github.com/WJSoftware/wj-config/tree/Version_2/examples).

## Release Candidate 0

1. Ability to condition the inclusion of a specified data source.
2. Specialized method to add per-environment configuration data sources.
3. Per-trait configuration:  Assign a list of traits to the current environment, then define data sources that should 
be applied depending on the existence of individual or sub-groups of traits, and let the builder decide whether or not 
the data sources should be included.  No more generating per-region or per-customer type configuration files.

### Breaking Changes

1. The property `environment.value` disappeared.  Use `environment.current.name` instead.
2. The property `environment.names` disappeared.  Use `environment.all` instead.

---

## Beta 2

1. Fixed the `FetchedConfigDataSource` class.  Now it properly returns an empty object if an error occurs after 
fetching **and** the data sources is **not required**. **NOTE**:  If you think I should cover the cases where fetching 
actually throws an error, create a new issue at the [project's homepage](https://github.com/WJSoftware/wj-config), 
**Issues** tab.
2. Now the builder's `createUrlFunctions()` function allows either an array of strings or a single string to specify 
which configuration properties should undergo URL function creation.  A single string is the same as a 1-element array.
3. Increased TypeScript's target version to ES2022.
4. Added the `engines` property to `package.json` to specify **NodeJS v16.9.0** as the minimum required **NodeJS** 
version for **wj-config** v2.0.0.

> Visit the [project's homepage](https://github.com/WJSoftware/wj-config) for the latest version of this README.
---
