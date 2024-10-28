import { buildEnvironment } from "../buildEnvironment.js";
import { DictionaryDataSource } from "../dataSources/DictionaryDataSource.js";
import { EnvironmentDataSource } from "../dataSources/EnvironmentDataSource.js";
import { FetchedDataSource } from "../dataSources/FetchedDataSource.js";
import { JsonDataSource } from "../dataSources/JsonDataSource.js";
import { ObjectDataSource } from "../dataSources/ObjectDataSource.js";
import { SingleValueDataSource } from "../dataSources/SingleValueDataSource.js";
import type { ConfigurationValue, IBuilder, IDataSource, IEnvironment, IncludeEnvironment, Predicate, ProcessFetchResponse, UrlBuilderSectionWithCheck } from "../wj-config.js";
import { BuilderImpl } from "./BuilderImpl.js";
import { EnvAwareBuilder, type IEnvironmentSource } from "./EnvAwareBuilder.js";

export class Builder<T extends Record<string, any> = {}> implements IBuilder<T> {
    #impl: BuilderImpl = new BuilderImpl();
    add<NewT extends Record<string, any>>(dataSource: IDataSource<NewT>) {
        this.#impl.add(dataSource);
        return this as unknown as IBuilder<Omit<T, keyof NewT> & NewT>;
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

    name(name: string) {
        this.#impl.name(name);
        return this;
    }

    when(predicate: () => boolean, dataSourceName?: string) {
        this.#impl.when(predicate, dataSourceName);
        return this;
    }

    includeEnvironment<TEnvironments extends string, TEnvironmentKey extends string = "environment">(
        valueOrEnv: TEnvironments | IEnvironment<TEnvironments>,
        propNameOrEnvNames?: TEnvironments[] | TEnvironmentKey,
        propertyName?: TEnvironmentKey
    ) {
        this.#impl._lastCallWasDsAdd = false;
        const propName = (typeof propNameOrEnvNames === 'string' ? propNameOrEnvNames : propertyName) ?? 'environment';
        const envNames = (propNameOrEnvNames && typeof propNameOrEnvNames !== 'string') ? propNameOrEnvNames : undefined;
        let env: IEnvironment<TEnvironments>;
        if (typeof valueOrEnv === 'object') {
            env = valueOrEnv;
        }
        else {
            env = buildEnvironment(valueOrEnv, envNames);
        }
        const _envSource: IEnvironmentSource<TEnvironments> = {
            name: propName,
            environment: env
        };
        return new EnvAwareBuilder<TEnvironments, Omit<T, TEnvironmentKey> & IncludeEnvironment<TEnvironments, TEnvironmentKey>>(_envSource, this.#impl);
    }

    createUrlFunctions<TUrl extends keyof T>(wsPropertyNames: TUrl | TUrl[], routeValuesRegExp?: RegExp) {
        this.#impl.createUrlFunctions(wsPropertyNames, routeValuesRegExp);
        return this as unknown as IBuilder<Omit<T, TUrl> & UrlBuilderSectionWithCheck<T, TUrl>>;
    }

    async build(traceValueSources: boolean = false, enforcePerEnvironmentCoverage: boolean = true) {
        return this.#impl.build(traceValueSources, p => p()) as unknown as T;
    }
};
