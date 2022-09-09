import type { ICoreConfig, IWsParent, IWsPath, QueryString, RouteValues, RouteValuesFunction } from "wj-config";
import { forEachProperty, isArray, isFunction, isConfig } from "./helpers.js";

const noop = (x?: any) => '';

const rootPathFn = '_rootPath';

function buildUrlImpl(
    this: IWsPath,
    path: string,
    routeValues?: RouteValues,
    routeRegex?: RegExp,
    queryString?: QueryString
) {
    let routeValuesFn: RouteValuesFunction | undefined = undefined;
    let index = 0;
    if (routeValues) {
        if (isFunction(routeValues)) {
            routeValuesFn = routeValues;
        }
        else if (isArray(routeValues)) {
            routeValuesFn = n => routeValues[index++];
        }
        else {
            routeValuesFn = n => routeValues[n];
        }
    }
    const rp = (this[rootPathFn] ?? noop)();
    let url = `${rp}${(path ?? '')}`;
    // Replace any replaceable route values.
    if (routeRegex && routeRegex.test(url) && routeValuesFn) {
        url = url.replace(routeRegex, (m, g1) => encodeURIComponent((routeValuesFn ?? noop)(g1)));
    }
    // Add query string values, if provided.
    if (queryString) {
        const qmPos = url.indexOf('?');
        if (qmPos < 0) {
            url += '?'
        } else if (url.length - qmPos - 1) {
            url += '&'
        }
        let qsValue: string | ICoreConfig | undefined;
        if (typeof queryString === 'function') {
            qsValue = queryString();
        }
        else {
            qsValue = queryString;
        }
        if (typeof qsValue === 'string') {
            // Prepared query string.  Just add to the url.
            url += qsValue
        }
        else {
            let qs = '';
            forEachProperty(qsValue, (key, value) => {
                qs += `${key}=${encodeURIComponent(value)}&`
            });
            if (qs.length > 0) {
                url += qs.substring(0, qs.length - 1)
            }
        }
    }
    return url;
}

function parentRootPath(this: IWsParent) {
    if (!this.host) {
        // When no host is present, build a relative URL starting with the root path.
        return this.rootPath ?? '';
    }
    return `${(this.scheme ?? 'http')}://${(this.host ?? '')}${(this.port ? ':' : '')}${(this.port ?? '')}${(this.rootPath ?? '')}`;
}

function pathRootPath(this: IWsPath, parent: IWsPath) {
    const rp = (parent[rootPathFn] ?? noop)();
    return `${rp}${(this.rootPath ?? '')}`;
}

function makeWsUrlFunctions(ws: IWsParent | ICoreConfig, routeValuesRegExp: RegExp, parent?: IWsParent) {
    if (!ws) {
        return;
    }
    if (!isConfig(ws)) {
        throw new Error(`Cannot operate on a non-object value (provided value is of type ${typeof ws}).`);
    }
    const shouldConvert = (name: string) => {
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
    const isRoot = (obj: object) => {
        // An object is a root object if it has host or rootPath.
        let yes = false;
        forEachProperty(obj, k => yes = ['host', 'rootPath'].includes(k));
        return yes;
    };
    // Add the _rootPath() function.
    let canBuildUrl = true;
    if (isRoot(ws) && (!parent?.buildUrl)) {
        ws[rootPathFn] = function () {
            return parentRootPath.bind((ws as IWsPath))();
        };
    }
    else if (parent !== undefined && parent[rootPathFn] !== undefined) {
        ws[rootPathFn] = function () {
            return pathRootPath.bind((ws as IWsPath))(parent);
        };
    }
    else {
        canBuildUrl = false;
    }
    if (canBuildUrl) {
        // Add the buildUrl function.
        ws.buildUrl = function (path: string, routeValues?: RouteValues, queryString?: QueryString) {
            return buildUrlImpl.bind((ws as IWsPath))(path, routeValues, routeValuesRegExp, queryString);
        };
    }
    // For every non-object property in the object, make it a function.
    // Properties that have an object are recursively configured.
    forEachProperty(ws, (key, value) => {
        const sc = shouldConvert(key);
        if (sc && canBuildUrl && typeof value === 'string') {
            ws[key] = function (routeValues?: RouteValues, queryString?: QueryString) {
                return ((this as IWsPath).buildUrl ?? noop)(value, routeValues, queryString);
            };
        }
        else if (sc && isConfig(value)) {
            // Object value.
            makeWsUrlFunctions(value as IWsParent, routeValuesRegExp, (ws as IWsParent));
        }
    });
};

export default makeWsUrlFunctions;
