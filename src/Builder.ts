import type { IBuilder, IConfig, ICoreConfig, IDataSource, IEnvironment, Predicate } from "wj-config"
import DictionaryDataSource from "./DictionaryDataSource.js"
import { Environment } from "./Environment.js"
import EnvironmentDataSource from "./EnvironmentDataSource.js"
import { isConfig } from "./helpers.js"
import makeWsUrlFunctions from "./makeWsUrlFunctions.js"
import merge from "./Merge.js"
import { ObjectDataSource } from "./ObjectDataSource.js"

interface IEnvironmentSource {
    name?: string,
    environment: IEnvironment
}

interface IUrlData {
    wsPropertyNames: string[];
    routeValuesRegExp: RegExp;
}

export default class Builder implements IBuilder {
    /**
     * Default list of property names that undergo the URL functions transformation.
     */
    static readonly defaultWsPropertyNames = ['ws'];

    /**
     * Collection of data sources added to the builder.
     */
    private _dataSources: Array<IDataSource> = [];

    /**
     * Environment source.
     */
    private _envSource?: IEnvironmentSource;

    /**
     * URL data used to create URL functions out of specific property values in the resulting configuration object.
     */
    private _urlData?: IUrlData;

    /**
     * Boolean value that indicates if the configuration values need to create a trace.
     */
    private _traceValueSource: boolean = false;

    /**
     * Flag to determine if the last call in the builder was the addition of a data source.
     */
    private _lastCallWasDsAdd: boolean = false;

    add(dataSource: IDataSource): IBuilder {
        this._dataSources.push(dataSource);
        dataSource.index = this._dataSources.length - 1;
        this._lastCallWasDsAdd = true;
        return this;
    }

    addObject(obj: ICoreConfig): IBuilder {
        return this.add(new ObjectDataSource(obj));
    }

    addDictionary(dictionary: ICoreConfig, hierarchySeparator: string = ':', prefixOrPredicate?: string | Predicate<string>): IBuilder {
        return this.add(new DictionaryDataSource(dictionary, hierarchySeparator, prefixOrPredicate));
    }

    addEnvironment(env: ICoreConfig, prefix: string = 'OPT_'): IBuilder {
        return this.add(new EnvironmentDataSource(env, prefix));
    }

    name(name: string): IBuilder {
        if (!this._lastCallWasDsAdd) {
            throw new Error('Names for data sources must be set immediately after adding the data source.');
        }
        this._lastCallWasDsAdd = false;
        this._dataSources[this._dataSources.length - 1].name = name;
        return this;
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

    includeValueTrace() {
        this._traceValueSource = true;
        return this;
    }

    createUrlFunctions(wsPropertyNames?: string[], routeValuesRegExp?: RegExp): IBuilder {
        this._lastCallWasDsAdd = false;
        this._urlData = {
            wsPropertyNames: wsPropertyNames && wsPropertyNames.length > 0 ? wsPropertyNames : Builder.defaultWsPropertyNames,
            routeValuesRegExp: routeValuesRegExp ?? /\{(\w+)\}/g
        };
        return this;
    }

    async build(): Promise<IConfig> {
        this._lastCallWasDsAdd = false;
        const dsTasks: Promise<ICoreConfig>[] = [];
        this._dataSources.forEach(ds => {
            dsTasks.push(ds.getObject());
        });
        const sources = await Promise.all(dsTasks);
        const wjConfig = merge(sources, this._traceValueSource ? this._dataSources : undefined);
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
            });
        }
        return wjConfig;
    }
};
