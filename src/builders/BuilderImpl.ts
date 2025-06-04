import { isConfigNode } from "../helpers.js";
import makeWsUrlFunctions from "../makeWsUrlFunctions.js";
import merge from "../Merge.js";
import { IDataSource, Predicate } from "../wj-config.js";

interface IUrlData {
    wsPropertyNames: string[];
    routeValuesRegExp: RegExp;
}

interface IDataSourceDef {
    dataSource: IDataSource<Record<string, any>>,
    predicate?: (env?: any) => boolean;
}

type PostMergeFn = (config: any) => any;

export class BuilderImpl {
    /**
     * Collection of data sources added to the builder.
     */
    _dsDefs: IDataSourceDef[] = [];
    /**
     * URL data used to create URL functions out of specific property values in the resulting configuration object.
     */
    _urlData?: IUrlData;
    /**
     * Flag to determine if the last call in the builder was the addition of a data source.
     */
    _lastCallWasDsAdd: boolean = false;
    #postMergeFns: PostMergeFn[] = [];

    postMerge(fn: PostMergeFn) {
        this._lastCallWasDsAdd = false;
        this.#postMergeFns.push(fn);
    }

    add(dataSource: IDataSource<Record<string, any>>) {
        this._dsDefs.push({
            dataSource: dataSource
        });
        dataSource.index = this._dsDefs.length - 1;
        this._lastCallWasDsAdd = true;
    }
    name(name: string) {
        if (!this._lastCallWasDsAdd) {
            throw new Error('Names for data sources must be set immediately after adding the data source or setting its conditional.');
        }
        this._dsDefs[this._dsDefs.length - 1].dataSource.name = name;
    }

    when(predicate: Predicate<any>, dataSourceName?: string) {
        if (!this._lastCallWasDsAdd) {
            throw new Error('Conditionals for data sources must be set immediately after adding the data source or setting its name.');
        }
        if (this._dsDefs[this._dsDefs.length - 1].predicate) {
            throw new Error('Cannot set more than one predicate (conditional) per data source, and the last-added data source already has a predicate.');
        }
        const dsDef = this._dsDefs[this._dsDefs.length - 1];
        dsDef.predicate = predicate;
        if (dataSourceName != undefined) {
            this.name(dataSourceName);
        }
    }

    createUrlFunctions(wsPropertyNames: string | number | symbol | (string | number | symbol)[], routeValuesRegExp?: RegExp) {
        this._lastCallWasDsAdd = false;
        let propNames: (string | number | symbol)[];
        if (typeof wsPropertyNames === 'string') {
            if (wsPropertyNames !== '') {
                propNames = [wsPropertyNames];
            }
        }
        else if (Array.isArray(wsPropertyNames) && wsPropertyNames.length > 0) {
            propNames = wsPropertyNames
        }
        else {
            throw new Error("The 'wsPropertyNames' property now has no default value and must be provided.");
        }
        this._urlData = {
            wsPropertyNames: propNames! as string[],
            routeValuesRegExp: routeValuesRegExp ?? /\{(\w+)\}/g
        };
    }

    async build(traceValueSources: boolean = false, evaluatePredicate: Predicate<Function>) {
        this._lastCallWasDsAdd = false;
        const qualifyingDs: IDataSource<Record<string, any>>[] = [];
        let wjConfig: Record<string, any> = {};
        if (this._dsDefs.length > 0) {
            // Prepare a list of qualifying data sources.  A DS qualifies if it has no predicate or
            // the predicate returns true.
            this._dsDefs.forEach(ds => {
                if (!ds.predicate || evaluatePredicate(ds.predicate)) {
                    qualifyingDs.push(ds.dataSource);
                }
            });
            if (qualifyingDs.length > 0) {
                const dsTasks: Promise<Record<string, any>>[] = [];
                qualifyingDs.forEach(ds => {
                    dsTasks.push(ds.getObject());
                });
                const sources = await Promise.all(dsTasks);
                sources.unshift(wjConfig);
                wjConfig = merge(sources, traceValueSources ? qualifyingDs : undefined);
            }
        }
        const urlData = this._urlData;
        if (urlData) {
            urlData.wsPropertyNames.forEach((value) => {
                const obj = wjConfig[value];
                if (isConfigNode(obj)) {
                    makeWsUrlFunctions(obj, urlData.routeValuesRegExp, globalThis.window && globalThis.window.location !== undefined);
                }
                else {
                    throw new Error(`The level 1 property "${value}" is not a node value (object), but it was specified as being an object containing URL-building information.`);
                }
            });
        }
        if (traceValueSources) {
            if (qualifyingDs.length > 0) {
                wjConfig._qualifiedDs = qualifyingDs.map(ds => ds.trace());
            }
            else {
                wjConfig._qualifiedDs = [];
            }
        }
        for (let fn of this.#postMergeFns) {
            wjConfig = await fn(wjConfig);
        }
        return wjConfig;
    }
}
