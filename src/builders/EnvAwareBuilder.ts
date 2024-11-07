import { DictionaryDataSource } from "../dataSources/DictionaryDataSource.js";
import { EnvironmentDataSource } from "../dataSources/EnvironmentDataSource.js";
import { FetchedDataSource } from "../dataSources/FetchedDataSource.js";
import { JsonDataSource } from "../dataSources/JsonDataSource.js";
import { ObjectDataSource } from "../dataSources/ObjectDataSource.js";
import { SingleValueDataSource } from "../dataSources/SingleValueDataSource.js";
import type { ConfigurationValue, IDataSource, IEnvAwareBuilder, IEnvironment, InflateDictionary, InflateKey, MergeResult, Predicate, ProcessFetchResponse, Traits, UrlBuilderSectionWithCheck } from "../wj-config.js";
import { BuilderImpl } from "./BuilderImpl.js";

export interface IEnvironmentSource<TEnvironments extends string> {
    name?: string,
    environment: IEnvironment<TEnvironments>;
}

export class EnvAwareBuilder<TEnvironments extends string, T extends Record<string, any> = {}> implements IEnvAwareBuilder<TEnvironments, T> {
    /**
     * Environment source.
     */
    private _envSource: IEnvironmentSource<TEnvironments>;
    #impl: BuilderImpl;

    constructor(envSource: IEnvironmentSource<TEnvironments>, impl: BuilderImpl) {
        this._envSource = envSource;
        this.#impl = impl;
    }

    add<NewT extends Record<string, any>>(dataSource: IDataSource<NewT>) {
        this.#impl.add(dataSource);
        return this as unknown as IEnvAwareBuilder<TEnvironments, MergeResult<T, NewT>>;
    }

    addObject<NewT extends Record<string, any>>(obj: NewT | (() => Promise<NewT>)) {
        return this.add(new ObjectDataSource(obj));
    }

    addDictionary<TDic extends Record<string, ConfigurationValue>, TSep extends string = ':'>(dictionary: Record<string, ConfigurationValue> | (() => Promise<Record<string, ConfigurationValue>>), hierarchySeparator: string = ':', prefixOrPredicate?: string | Predicate<string>) {
        // @ts-expect-error
        return this.add<InflateDictionary<TDic, TSep>>(new DictionaryDataSource(dictionary, hierarchySeparator, prefixOrPredicate));
    }

    addEnvironment<TDic extends Record<string, ConfigurationValue>, TPrefix extends string = 'OPT_'>(env: Record<string, ConfigurationValue> | (() => Promise<Record<string, ConfigurationValue>>), prefix: string = 'OPT_') {
        return this.add<MergeResult<T, InflateDictionary<TDic, '__', TPrefix>>>(new EnvironmentDataSource(env, prefix));
    }

    addFetched<NewT extends Record<string, any>>(input: URL | RequestInfo | (() => Promise<URL | RequestInfo>), required: boolean = true, init?: RequestInit, procesFn?: ProcessFetchResponse<NewT>) {
        return this.add<NewT>(new FetchedDataSource(input, required, init, procesFn));
    }

    addJson<NewT extends Record<string, any>>(json: string | (() => Promise<string>), jsonParser?: JSON, reviver?: (this: any, key: string, value: any) => any) {
        return this.add<NewT>(new JsonDataSource(json, jsonParser, reviver));
    }

    addSingleValue<TKey extends string, TValue extends ConfigurationValue, TSep extends string = ':'>(path: TKey | (() => Promise<[TKey, TValue]>), valueOrHierarchySeparator?: TValue | TSep, hierarchySeparator?: TSep) {
        return this.add(new SingleValueDataSource<MergeResult<T, InflateKey<TKey, TValue, TSep>>>(path, valueOrHierarchySeparator, typeof path === 'function' ? valueOrHierarchySeparator as string : hierarchySeparator));
    }

    name(name: string) {
        this.#impl.name(name);
        return this;
    }

    createUrlFunctions<TUrl extends keyof T>(wsPropertyNames: TUrl | TUrl[], routeValuesRegExp?: RegExp) {
        this.#impl.createUrlFunctions(wsPropertyNames, routeValuesRegExp);
        return this as unknown as IEnvAwareBuilder<TEnvironments, Omit<T, TUrl> & UrlBuilderSectionWithCheck<T, TUrl>>;
    }

    /**
     * Boolean flag used to raise an error if there was no call to includeEnvironment() when it is known to be needed.
     */
    private _envIsRequired: boolean = false;

    /**
     * Dictionary of environment names that have been configured with a data source using the addPerEnvironment() 
     * helper function.  The value is the number of times the environment name has been used.
     */
    private _perEnvDsCount: Record<Exclude<TEnvironments, undefined>, number> | null = null;

    addPerEnvironment<NewT extends Record<string, any>>(addDs: (builder: IEnvAwareBuilder<TEnvironments, T>, envName: TEnvironments) => boolean | string) {
        if (!this._envSource) {
            throw new Error('Using addPerEnvironment() requires a prior call to includeEnvironment().');
        }
        this._envSource.environment.all.forEach(n => {
            const result = addDs(this, n);
            if (result !== false) {
                this.forEnvironment(n, typeof result === 'string' ? result : undefined);
            }
        });
        return this as unknown as IEnvAwareBuilder<TEnvironments, MergeResult<T, NewT>>;
    }

    when(predicate: Predicate<IEnvironment<TEnvironments> | undefined>, dataSourceName?: string) {
        this.#impl.when(predicate, dataSourceName);
        return this;
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

    async build(traceValueSources: boolean = false, enforcePerEnvironmentCoverage: boolean = true) {
        this.#impl._lastCallWasDsAdd = false;
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
        const result = await this.#impl.build(traceValueSources, p => p(this._envSource?.environment));
        const envPropertyName = this._envSource.name ?? 'environment';
        if (result[envPropertyName] !== undefined) {
            throw new Error(`Cannot use property name "${envPropertyName}" for the environment object because it was defined for something else.`);
        }
        result[envPropertyName] = this._envSource.environment;
        return result as T;
    }
}