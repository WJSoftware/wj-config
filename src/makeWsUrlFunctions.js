'use strict';
const helpers = require('./helpers');

const makeWsUrlFunctions = (ws, parent) => {
    if (!ws) {
        return;
    }
    if (!helpers.isObject(ws)) {
        throw new Error(`Cannot operate on a non-object value (provided value is of type ${typeof ws}).`);
    }
    const shouldConvert = name => {
        // Any property in this list or whose name starts with underscore (_) are skipped.
        const exceptions = [
            'host',
            'port',
            'scheme',
            'rootPath',
            'buildUrl'
        ];
        return !name.startsWith('_') && !exceptions.includes(name);
    };
    const isRoot = obj => {
        // An object is a root object if it has host or rootPath.
        let yes = false;
        helpers.forEachProperty(obj, k => yes = ['host', 'rootPath'].includes(k));
        return yes;
    };
    // Add the _rootPath() function.
    const rootPathFn = '_rootPath';
    let canBuildUrl = true;
    if (isRoot(ws) && (!parent?.buildUrl)) {
        ws[rootPathFn] = function () {
            if (!this.host) {
                // When no host is present, build a relative URL starting with the root path.
                return this.rootPath ?? '';
            }
            return `${(this.scheme ?? 'http')}://${(this.host ?? '')}${(this.port ? ':' : '')}${(this.port ?? '')}${(this.rootPath ?? '')}`;
        };
    }
    else if (parent !== undefined && parent[rootPathFn] !== undefined) {
        ws[rootPathFn] = function () {
            const rp = parent[rootPathFn]();
            return `${rp}${(this.rootPath ?? '')}`;
        };
    }
    else {
        canBuildUrl = false;
    }
    if (canBuildUrl) {
        // Add the buildUrl function.
        ws.buildUrl = function (path, routeValues) {
            let routeValuesFn = null;
            let index = 0;
            if (routeValues) {
                if (helpers.isFunction(routeValues)) {
                    routeValuesFn = n => routeValues(n);
                }
                else if (helpers.isArray(routeValues)) {
                    routeValuesFn = n => routeValues[index++];
                }
                else {
                    routeValuesFn = n => routeValues[n];
                }
            }
            const rp = this[rootPathFn]();
            let url = `${rp}${(path ?? '')}`;
            // Replace any replaceable route values.
            const routeRegex = /\{(\w+)\}/g;
            if (routeRegex.test(url) && routeValuesFn) {
                url = url.replace(routeRegex, (m, g1) => routeValuesFn(g1));
            }
            return url;
        };
    }
    // For every non-object property in the object, make it a function.
    // Properties that have an object are recursively configured.
    helpers.forEachProperty(ws, (key, value) => {
        const sc = shouldConvert(key);
        if (sc && canBuildUrl && !helpers.isObject(value)) {
            ws[`_${key}`] = value;
            ws[key] = function (routeValues) {
                return this.buildUrl(value, routeValues);
            };
        }
        else if (sc && helpers.isObject(value)) {
            // Object value.
            makeWsUrlFunctions(value, ws);
        }
    });
};

module.exports = makeWsUrlFunctions;
