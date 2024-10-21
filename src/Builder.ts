import type { ConfigurationValue, IBuilder, IDataSource, IEnvironment, IncludeEnvironment, Predicate, ProcessFetchResponse, Traits, UrlBuilderSectionWithCheck } from "wj-config";
import DictionaryDataSource from "./DictionaryDataSource.js";
import { buildEnvironment } from "./Environment.js";
import EnvironmentDataSource from "./EnvironmentDataSource.js";
import FetchedDataSource from "./FetchedDataSource.js";
import { isConfigNode } from "./helpers.js";
import JsonDataSource from "./JsonDataSource.js";
import makeWsUrlFunctions from "./makeWsUrlFunctions.js";
import merge from "./Merge.js";
import { ObjectDataSource } from "./ObjectDataSource.js";
import SingleValueDataSource from "./SingleValueDataSource.js";

interface IEnvironmentSource<TEnvironments extends string | undefined> {
    name?: string,
    environment: IEnvironment<Exclude<TEnvironments, undefined>>;
}

interface IUrlData {
    wsPropertyNames: string[];
    routeValuesRegExp: RegExp;
}

interface IDataSourceDef<TEnvironments extends string | undefined> {
    dataSource: IDataSource<Record<string, any>>,
    predicate?: Predicate<IEnvironment<Exclude<TEnvironments, undefined>> | undefined>
}

export default class Builder<T extends Record<string, any>= {}, TEnvironments extends string | undefined = undefined> implements IBuilder<T, TEnvironments> {
    /**
     * Collection of data sources added to the builder.
     */
    private _dsDefs: IDataSourceDef<TEnvironments>[] = [];

    /**
     * Environment source.
     */
    private _envSource?: IEnvironmentSource<TEnvironments>;

    /**
     * Boolean flag used to raise an error if there was no call to includeEnvironment() when it is known to be needed.
     */
    private _envIsRequired: boolean = false;

    /**
     * Dictionary of environment names that have been configured with a data source using the addPerEnvironment() 
     * helper function.  The value is the number of times the environment name has been used.
     */
    private _perEnvDsCount: Record<Exclude<TEnvironments, undefined>, number> | null = null;

    /**
     * URL data used to create URL functions out of specific property values in the resulting configuration object.
     */
    private _urlData?: IUrlData;

    /**
     * Flag to determine if the last call in the builder was the addition of a data source.
     */
    private _lastCallWasDsAdd: boolean = false;

    add<NewT extends Record<string, any>>(dataSource: IDataSource<NewT>) {
        this._dsDefs.push({
            dataSource: dataSource
        });
        dataSource.index = this._dsDefs.length - 1;
        this._lastCallWasDsAdd = true;
        return this as unknown as IBuilder<Omit<T, keyof NewT> & NewT, TEnvironments>;
    }

    addObject<NewT extends Record<string, any>>(obj: NewT | (() => Promise<NewT>)) {
        return this.add(new ObjectDataSource(obj));
    }

    addDictionary<NewT extends Record<string, any>>(dictionary: Record<string, ConfigurationValue> | (() => Promise<Record<string, ConfigurationValue>>), hierarchySeparator: string = ':', prefixOrPredicate?: string | Predicate<string>) {
        return this.add<NewT>(new DictionaryDataSource(dictionary, hierarchySeparator, prefixOrPredicate));
    }

    addEnvironment<NewT extends Record<string, any>>(env: Record<string, ConfigurationValue> | (() => Promise<Record<string, ConfigurationValue>>), prefix: string = 'OPT_') {
        return this.add<NewT>(new EnvironmentDataSource(env, prefix));
    }

    addFetched<NewT extends Record<string, any>>(input: URL | RequestInfo | (() => Promise<URL | RequestInfo>), required: boolean = true, init?: RequestInit, procesFn?: ProcessFetchResponse<NewT>) {
        return this.add<NewT>(new FetchedDataSource(input, required, init, procesFn));
    }

    addJson<NewT extends Record<string, any>>(json: string | (() => Promise<string>), jsonParser?: JSON, reviver?: (this: any, key: string, value: any) => any) {
        return this.add<NewT>(new JsonDataSource(json, jsonParser, reviver));
    }

    addSingleValue<NewT extends Record<string, any>>(path: string | (() => Promise<[string, ConfigurationValue]>), valueOrHierarchySeparator?: ConfigurationValue | string, hierarchySeparator?: string) {
        return this.add<NewT>(new SingleValueDataSource<NewT>(path, valueOrHierarchySeparator, typeof path === 'function' ? valueOrHierarchySeparator as string : hierarchySeparator));
    }

    addPerEnvironment<NewT extends Record<string, any>>(addDs: (builder: IBuilder<T, TEnvironments>, envName: TEnvironments) => boolean | string) {
        if (!this._envSource) {
            throw new Error('Using addPerEnvironment() requires a prior call to includeEnvironment().');
        }
        this._envSource.environment.all.forEach(n => {
            const result = addDs(this, n);
            if (result !== false) {
                this.forEnvironment(n, typeof result === 'string' ? result : undefined);
            }
        });
        return this as unknown as IBuilder<Omit<T, keyof NewT> & NewT, TEnvironments>;
    }

    name(name: string) {
        if (!this._lastCallWasDsAdd) {
            throw new Error('Names for data sources must be set immediately after adding the data source or setting its conditional.');
        }
        this._dsDefs[this._dsDefs.length - 1].dataSource.name = name;
        return this as unknown as IBuilder<T, TEnvironments>;
    }

    when(predicate: Predicate<IEnvironment<Exclude<TEnvironments, undefined>> | undefined>, dataSourceName?: string) {
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
        return this as unknown as IBuilder<T, TEnvironments>;
    }

    whenAllTraits(traits: Traits, dataSourceName?: string) {
        this._envIsRequired = true;
        return this.when(env => {
            return env!.hasTraits(traits) ?? false;
        }, dataSourceName);
    }

    whenAnyTrait(traits: Traits, dataSourceName?: string) {
        this._envIsRequired = true;
        return this.when(env => {
            return env!.hasAnyTrait(traits);
        }, dataSourceName);
    }

    forEnvironment(envName: Exclude<TEnvironments, undefined>, dataSourceName?: string) {
        this._envIsRequired = true;
        this._perEnvDsCount = this._perEnvDsCount ?? {} as Record<Exclude<TEnvironments, undefined>, number>;
        let count = this._perEnvDsCount[envName] ?? 0;
        this._perEnvDsCount[envName] = ++count;
        dataSourceName =
            dataSourceName ??
            (count === 1 ? `${envName} (environment-specific)` : `${envName} #${count} (environment-specific)`);
        return this.when(e => e?.current.name === envName, dataSourceName);
    }

    includeEnvironment<TEnvironmentKey extends string = "environment">(
        valueOrEnv: Exclude<TEnvironments, undefined> | IEnvironment<Exclude<TEnvironments, undefined>>,
        propNameOrEnvNames?: Exclude<TEnvironments, undefined>[] | TEnvironmentKey, propertyName?: TEnvironmentKey
    ) {
        this._lastCallWasDsAdd = false;
        const propName = (typeof propNameOrEnvNames === 'string' ? propNameOrEnvNames : propertyName) ?? 'environment';
        const envNames = (propNameOrEnvNames && typeof propNameOrEnvNames !== 'string') ? propNameOrEnvNames : undefined;
        let env: IEnvironment<Exclude<TEnvironments, undefined>>;
        if (typeof valueOrEnv === 'object') {
            env = valueOrEnv;
        }
        else {
            env = buildEnvironment(valueOrEnv, envNames);
        }
        this._envSource = {
            name: propName,
            environment: env
        };
        return this as unknown as IBuilder<Omit<T, TEnvironmentKey> & IncludeEnvironment<TEnvironmentKey>, TEnvironments>;
    }

    createUrlFunctions<TUrl extends keyof T>(wsPropertyNames: TUrl | TUrl[], routeValuesRegExp?: RegExp) {
        this._lastCallWasDsAdd = false;
        let propNames: TUrl[];
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
        return this as unknown as IBuilder<Omit<T, TUrl> & UrlBuilderSectionWithCheck<T, TUrl>>;
    }

    async build(traceValueSources: boolean = false, enforcePerEnvironmentCoverage: boolean = true) {
        this._lastCallWasDsAdd = false;
        // See if environment is required.
        if (this._envIsRequired && !this._envSource) {
            throw new Error('The used build steps include at least one step that requires environment information.  Ensure you are using "includeEnvironment()" as part of the build chain.');
        }
        // See if forEnvironment was used.
        if (this._perEnvDsCount) {
            // Ensure all specified environments are part of the possible list of environments.
            let envCount = 0;
            for (const e in this._perEnvDsCount) {
                if (!this._envSource!.environment.all.includes(e as Exclude<TEnvironments, undefined>)) {
                    throw new Error(`The environment name "${e}" was used in a call to forEnvironment(), but said name is not part of the list of possible environment names.`);
                }
                ++envCount;
            }
            if (enforcePerEnvironmentCoverage) {
                // Ensure all possible environment names were included.
                const totalEnvs = (this._envSource as IEnvironmentSource<TEnvironments>).environment.all.length;
                if (envCount !== totalEnvs) {
                    throw new Error(`Only ${envCount} environment(s) were configured using forEnvironment() out of a total of ${totalEnvs} environment(s).  Either complete the list or disable this check when calling build().`);
                }
            }
        }
        const qualifyingDs: IDataSource<Record<string, any>>[] = [];
        let wjConfig: Record<string, any>;
        if (this._dsDefs.length > 0) {
            // Prepare a list of qualifying data sources.  A DS qualifies if it has no predicate or
            // the predicate returns true.
            this._dsDefs.forEach(ds => {
                if (!ds.predicate || ds.predicate(this._envSource?.environment)) {
                    qualifyingDs.push(ds.dataSource);
                }
            });
            if (qualifyingDs.length > 0) {
                const dsTasks: Promise<Record<string, any>>[] = [];
                qualifyingDs.forEach(ds => {
                    dsTasks.push(ds.getObject());
                });
                const sources = await Promise.all(dsTasks);
                wjConfig = merge(sources, traceValueSources ? qualifyingDs : undefined);
            }
            else {
                wjConfig = {};
            }
        }
        else {
            wjConfig = {};
        }
        if (this._envSource) {
            const envPropertyName = this._envSource.name ?? 'environment';
            if (wjConfig[envPropertyName] !== undefined) {
                throw new Error(`Cannot use property name "${envPropertyName}" for the environment object because it was defined for something else.`);
            }
            wjConfig[envPropertyName] = this._envSource.environment;
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
        return wjConfig as T;
    }
};

