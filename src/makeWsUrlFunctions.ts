import type { ICoreConfig, IWsParent, IWsPath } from "wj-config";
import { forEachProperty, isArray, isFunction, isConfig } from "./helpers.js";

const noop = (x?: any) => '';

type RouteValuesFunction = (name: string) => string
type RouteValues = RouteValuesFunction | { [x: string]: string }

const rootPathFn = '_rootPath';

function buildUrlImpl(this: IWsPath, path: string, routeValues: RouteValues, routeRegex: RegExp) {
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
    if (routeRegex.test(url) && routeValuesFn) {
        url = url.replace(routeRegex, (m, g1) => (routeValuesFn ?? noop)(g1));
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
        ws.buildUrl = function (path: string, routeValues: RouteValues) {
            return buildUrlImpl.bind((ws as IWsPath))(path, routeValues, routeValuesRegExp);
        };
    }
    // For every non-object property in the object, make it a function.
    // Properties that have an object are recursively configured.
    forEachProperty(ws, (key, value) => {
        const sc = shouldConvert(key);
        if (sc && canBuildUrl && !isConfig(value)) {
            ws[key] = function (routeValues: RouteValues) {
                return ((this as IWsPath).buildUrl ?? noop)(value, routeValues);
            };
        }
        else if (sc && isConfig(value)) {
            // Object value.
            makeWsUrlFunctions(value as IWsParent, routeValuesRegExp, (ws as IWsParent));
        }
    });
};

export default makeWsUrlFunctions;
