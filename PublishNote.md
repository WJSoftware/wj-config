> Second Release Candiate!

## Release Candidate 3

1. Small performance improvement on how URL-building functions work.
2. Corrected references of `window` to be part of `globalThis` so NodeJS won't complain.

## Release Candidate 2

1. When running in the browser, config can specify `scheme` or `port` without a host.  This creates absolute URL's 
using the value of `window.location.hostname`.
2. Intellisense corrections.
3. Dictionary validation has been enhanced to detect non-flat objects on construction.  This only happens when not 
deferring the object by providing a function.
4. Data-delaying functions (the functions that provide the main, or data, argument to data sources) can now be 
asynchronous.

### Breaking Changes

1. `IBuilder.addFetchedConfig()` has been renamed to `addFetched()`.
2. `IBuilder.addSingleValue()` has been split into two overloads.

## Release Candidate 1

1. Added various minor fixes as the bugs were revealed by unit testing.

### Breaking Changes

1. The **ComputedDataSource** source has been deleted.  Now all data sources accept deferred execution of their 
*"main"* (or "data") argument.  Long story short:  Change `addComputed` to `addObject` and all will work just fine.

## Release Candidate 0

1. Ability to condition the inclusion of a specified data source.
2. Specialized method to add per-environment configuration data sources.
3. Per-trait configuration:  Assign a list of traits to the current environment, then define data sources that should 
be applied depending on the existence of individual or sub-groups of traits, and let the builder decide whether or not 
the data sources should be included.  No more generating per-region or per-customer type configuration files.

### Breaking Changes

1. The property `environment.value` disappeared.  Use `environment.current.name` instead.
2. The property `environment.names` disappeared.  Use `environment.all` instead.

> Unit testing is still in progress, so it is highly probable you'll see an RC2 in the next few weeks.

> Visit the [project's homepage](https://github.com/WJSoftware/wj-config) for the latest version of this README.
---
