import type { ConfigurationNode, QueryStringArg, RouteReplacementArg, RouteValuesFn, UrlNode, UrlRoot } from "wj-config";
import { forEachProperty, isArray, isConfigNode, isFunction } from "./helpers.js";

const noop = (x?: any) => '';

const rootPathFn = '_rootPath';
const rootUrlObjectProps = ['host', 'rootPath'];
const rootUrlObjectPropsForBrowser = ['host', 'rootPath', 'scheme', 'port'];

function buildUrlImpl(
    this: UrlNode,
    path: string,
    routeValues?: RouteReplacementArg,
    routeRegex?: RegExp,
    queryString?: QueryStringArg
) {
    let routeValuesFn: RouteValuesFn | undefined = undefined;
    let index = 0;
    if (routeValues) {
        if (typeof routeValues === 'function') {
            routeValuesFn = routeValues as RouteValuesFn;
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
    if (routeRegex && routeValuesFn && routeRegex.test(url)) {
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
        let qsValue: string | Record<string, any> | undefined;
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
                qs += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`
            });
            if (qs.length > 0) {
                url += qs.substring(0, qs.length - 1)
            }
        }
    }
    return url;
}

/**
 * Builds a relative, absolute or full URL using the information found in the root node and taking into account if the 
 * code is running in the browser.
 * @param this URL root node holding the URL information.
 * @param isBrowser A Boolean value that indicates if code is running in the browser.
 * @returns The relative, absolute or full URL, product of the information in the root node.
 */
function parentRootPath(this: UrlRoot, isBrowser: boolean) {
    if ((!this.host && !isBrowser) || (!this.host && !this.port && !this.scheme)) {
        // When no host outside the browser, or no host, port or scheme in the browser,
        // build a relative URL starting with the root path.
        return this.rootPath ?? '';
    }
    return `${(this.scheme ?? 'http')}://${(this.host ?? globalThis.window?.location?.hostname ?? '')}${(this.port ? `:${this.port}` : '')}${(this.rootPath ?? '')}`;
}

/**
 * Builds a relative, absolute or full URL by appending path information to the generated URL from the parent node.
 * @param this URL node holding path information.
 * @param parent Parent node.
 * @returns The relative, absolute or full URL built by appending path information to the parent's generated URL.
 */
function pathRootPath(this: UrlNode, parent: UrlNode) {
    const rp = (parent[rootPathFn] ?? noop)();
    return `${rp}${(this.rootPath ?? '')}`;
}

function makeWsUrlFunctions(ws: UrlRoot | ConfigurationNode, routeValuesRegExp: RegExp, isBrowser: boolean, parent?: UrlRoot) {
    if (!ws) {
        return;
    }
    if (!isConfigNode(ws)) {
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
    const isUrlRoot = (obj: object): obj is UrlRoot => {
        // An object is a root object if it has host or rootPath, or if code is running in a browser, an object is a
        // root object if it has any of the reserved properties.
        let yes = false;
        forEachProperty(obj, k => yes = rootUrlObjectProps.includes(k) || (isBrowser && rootUrlObjectPropsForBrowser.includes(k)));
        return yes;
    };
    const isUrlNode = (obj: unknown, parent: UrlNode | undefined): obj is UrlNode => {
        return !!parent?.[rootPathFn] || !!(obj as UrlNode)._rootPath;
    }
    // Add the _rootPath() function.
    if (isUrlRoot(ws) && (!parent?.buildUrl)) {
        ws[rootPathFn] = function () {
            return parentRootPath.bind(ws)(isBrowser);
        };
    }
    else if (isUrlNode(ws, parent)) {
        ws[rootPathFn] = function () {
            return pathRootPath.bind(ws)(parent!);
        };
    }
    if (isUrlNode(ws, parent)) {
        // Add the buildUrl function.
        ws.buildUrl = function (path: string, routeValues?: RouteReplacementArg, queryString?: QueryStringArg) {
            return buildUrlImpl.bind((ws as UrlNode))(path, routeValues, routeValuesRegExp, queryString);
        };
    }
    const canServeAsParent = isUrlNode(ws, undefined);
    // For every non-object property in the object, make it a function.
    // Properties that have an object are recursively configured.
    forEachProperty(ws, (key, value) => {
        const sc = shouldConvert(key);
        if (sc && canServeAsParent && typeof value === 'string') {
            (ws as UrlNode)[key] = function (routeValues?: RouteReplacementArg, queryString?: QueryStringArg) {
                return (ws.buildUrl ?? noop)(value, routeValues, queryString);
            };
        }
        else if (sc && isConfigNode(value)) {
            // Object value.
            makeWsUrlFunctions(value, routeValuesRegExp, isBrowser, canServeAsParent ? ws : undefined);
        }
    });
};

export default makeWsUrlFunctions;
