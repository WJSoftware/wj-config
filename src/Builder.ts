import type { ComputedConfigFunction, ConfigurationValue, IBuilder, IConfig, ICoreConfig, IDataSource, IEnvironment, Predicate, ProcessFetchResponse, Traits } from "wj-config";
import { ComputedDataSource } from "./ComputedDataSource.js";
import DictionaryDataSource from "./DictionaryDataSource.js"
import { Environment } from "./Environment.js"
import EnvironmentDataSource from "./EnvironmentDataSource.js"
import FetchedConfigDataSource from "./FetchedConfigDataSource.js";
import { isConfig } from "./helpers.js"
import JsonDataSource from "./JsonDataSource.js";
import makeWsUrlFunctions from "./makeWsUrlFunctions.js"
import merge from "./Merge.js"
import { ObjectDataSource } from "./ObjectDataSource.js"
import SingleValueDataSource from "./SingleValueDataSource.js";

interface IEnvironmentSource {
    name?: string,
    environment: IEnvironment
}

interface IUrlData {
    wsPropertyNames: string[];
    routeValuesRegExp: RegExp;
}

interface IDataSourceDef {
    dataSource: IDataSource,
    predicate?: Predicate<IEnvironment | undefined>
}

export default class Builder implements IBuilder {
    /**
     * Default list of property names that undergo the URL functions transformation.
     */
    static readonly defaultWsPropertyNames = ['ws'];

    /**
     * Collection of data sources added to the builder.
     */
    private _dsDefs: IDataSourceDef[] = [];

    /**
     * Environment source.
     */
    private _envSource?: IEnvironmentSource;

    /**
     * Boolean flag used to raise an error if there was no call to includeEnvironment() when it is known to be needed.
     */
    private _envIsRequired: boolean = false;

    /**
     * Dictionary of environment names that have been configured with a data source using the addPerEnvironment() 
     * helper function.  The value is the number of times the environment name has been used.
     */
    private _perEnvDsCount: { [x: string]: number } | null = null;

    /**
     * URL data used to create URL functions out of specific property values in the resulting configuration object.
     */
    private _urlData?: IUrlData;

    /**
     * Flag to determine if the last call in the builder was the addition of a data source.
     */
    private _lastCallWasDsAdd: boolean = false;

    add(dataSource: IDataSource): IBuilder {
        this._dsDefs.push({
            dataSource: dataSource
        });
        dataSource.index = this._dsDefs.length - 1;
        this._lastCallWasDsAdd = true;
        return this;
    }

    addObject(obj: ICoreConfig): IBuilder {
        return this.add(new ObjectDataSource(obj));
    }

    addComputed(fn: ComputedConfigFunction): IBuilder {
        return this.add(new ComputedDataSource(fn));
    }

    addDictionary(dictionary: ICoreConfig, hierarchySeparator: string = ':', prefixOrPredicate?: string | Predicate<string>): IBuilder {
        return this.add(new DictionaryDataSource(dictionary, hierarchySeparator, prefixOrPredicate));
    }

    addEnvironment(env: ICoreConfig, prefix: string = 'OPT_'): IBuilder {
        return this.add(new EnvironmentDataSource(env, prefix));
    }

    addFetchedConfig(input: URL | RequestInfo, required: boolean = true, init?: RequestInit, procesFn?: ProcessFetchResponse): IBuilder {
        return this.add(new FetchedConfigDataSource(input, required, init, procesFn));
    }

    addJson(json: string, jsonParser?: JSON, reviver?: (this: any, key: string, value: any) => any) {
        return this.add(new JsonDataSource(json, jsonParser, reviver));
    }

    addSingleValue(path: string, value: ConfigurationValue, hierarchySeparator?: string): IBuilder {
        return this.add(new SingleValueDataSource(path, value, hierarchySeparator));
    }

    name(name: string): IBuilder {
        if (!this._lastCallWasDsAdd) {
            throw new Error('Names for data sources must be set immediately after adding the data source or setting its conditional.');
        }
        this._dsDefs[this._dsDefs.length - 1].dataSource.name = name;
        return this;
    }

    when(predicate: Predicate<IEnvironment | undefined>, dataSourceName?: string): IBuilder {
        if (!this._lastCallWasDsAdd) {
            throw new Error('Conditionals for data sources must be set immediately after adding the data source or setting its name.');
        }
        if (this._dsDefs[this._dsDefs.length - 1].predicate) {
            throw new Error('Cannot set more than one prediate (conditional) per data source, and the last-added data source already has a predicate.');
        }
        const dsDef = this._dsDefs[this._dsDefs.length - 1];
        dsDef.predicate = predicate;
        if (dataSourceName != undefined) {
            this.name(dataSourceName);
        }
        return this;
    }

    whenAllTraits(traits: Traits, dataSourceName?: string): IBuilder {
        this._envIsRequired = true;
        return this.when(env => {
            return (env as IEnvironment).hasTraits(traits);
        }, dataSourceName);
    }

    whenAnyTrait(traits: Traits, dataSourceName?: string): IBuilder {
        this._envIsRequired = true;
        return this.when(env => {
            return (env as IEnvironment).hasAnyTrait(traits);
        }, dataSourceName);
    }

    forEnvironment(envName: string, dataSourceName?: string): IBuilder {
        this._envIsRequired = true;
        this._perEnvDsCount = this._perEnvDsCount ?? {};
        let count = this._perEnvDsCount[envName] ?? 0;
        this._perEnvDsCount[envName] = ++count;
        dataSourceName =
            dataSourceName ??
            (count === 1 ? `${envName} (environment-specific)` : `${envName} #${count} (environment-specific)`);
        return this.when(e => e?.current.name === envName, dataSourceName);
    }

    includeEnvironment(valueOrEnv: string | IEnvironment, propNameOrEnvNames?: string[] | string, propertyName?: string): IBuilder {
        this._lastCallWasDsAdd = false;
        const propName = typeof propNameOrEnvNames === 'string' ? propNameOrEnvNames : propertyName;
        const envNames = propNameOrEnvNames && typeof propNameOrEnvNames !== 'string' ? propNameOrEnvNames : Environment.defaultNames;
        let env: IEnvironment | undefined = undefined;
        if (typeof valueOrEnv === 'string') {
            env = new Environment(valueOrEnv, envNames);
        }
        else {
            env = valueOrEnv;
        }
        this._envSource = {
            name: propName,
            environment: env
        };
        return this;
    }

    createUrlFunctions(wsPropertyNames?: string | string[], routeValuesRegExp?: RegExp): IBuilder {
        this._lastCallWasDsAdd = false;
        let propNames = null;
        if (typeof wsPropertyNames === 'string') {
            if (wsPropertyNames !== '') {
                propNames = [wsPropertyNames];
            }
        }
        else if (wsPropertyNames && wsPropertyNames.length > 0) {
            propNames = wsPropertyNames
        }
        else {
            propNames = Builder.defaultWsPropertyNames;
        }
        this._urlData = {
            wsPropertyNames: propNames as string[],
            routeValuesRegExp: routeValuesRegExp ?? /\{(\w+)\}/g
        };
        return this;
    }

    async build(traceValueSources: boolean = false, enforcePerEnvironmentCoverage: boolean = true): Promise<IConfig> {
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
                if (!(this._envSource as IEnvironmentSource).environment.all.includes(e)) {
                    throw new Error(`The environment name "${e}" was used in a call to forEnvironment(), but said name is not part of the list of possible environment names.`);
                }
                ++envCount;
            }
            if (enforcePerEnvironmentCoverage) {
                // Ensure all possible environment names were included.
                const totalEnvs = (this._envSource as IEnvironmentSource).environment.all.length;
                if (envCount !== totalEnvs) {
                    throw new Error(`Only ${envCount} environment(s) were configured using forEnvironment() out of a total of ${totalEnvs} environment(s).  Either complete the list or disable this check when calling build().`);
                }
            }
        }
        const qualifyingDs: IDataSource[] = [];
        let wjConfig: ICoreConfig;
        if (this._dsDefs.length > 0) {
            // Prepare a list of qualifying data sources.  A DS qualifies if it has no predicate or
            // the predicate returns true.
            this._dsDefs.forEach(ds => {
                if (!ds.predicate || ds.predicate(this._envSource?.environment)) {
                    qualifyingDs.push(ds.dataSource);
                }
            });
            if (qualifyingDs.length > 0) {
                const dsTasks: Promise<ICoreConfig>[] = [];
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
                if (isConfig(obj)) {
                    makeWsUrlFunctions(obj, urlData.routeValuesRegExp);
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
        return wjConfig;
    }
};
