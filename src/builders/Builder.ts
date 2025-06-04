import { buildEnvironment } from "../buildEnvironment.js";
import { DictionaryDataSource } from "../dataSources/DictionaryDataSource.js";
import { EnvironmentDataSource } from "../dataSources/EnvironmentDataSource.js";
import { FetchedDataSource } from "../dataSources/FetchedDataSource.js";
import { JsonDataSource } from "../dataSources/JsonDataSource.js";
import { ObjectDataSource } from "../dataSources/ObjectDataSource.js";
import { SingleValueDataSource } from "../dataSources/SingleValueDataSource.js";
import type { ConfigurationValue, IBuilder, IDataSource, IEnvironment, IncludeEnvironment, InflateDictionary, InflateKey, MergeResult, Predicate, ProcessFetchResponse, UrlBuilderSectionWithCheck } from "../wj-config.js";
import { BuilderImpl } from "./BuilderImpl.js";
import { EnvAwareBuilder, type IEnvironmentSource } from "./EnvAwareBuilder.js";

export class Builder<T extends Record<string, any> = {}> implements IBuilder<T> {
    #impl: BuilderImpl = new BuilderImpl();
    add<NewT extends Record<string, any>>(dataSource: IDataSource<NewT>) {
        this.#impl.add(dataSource);
        return this as unknown as IBuilder<MergeResult<T, NewT>>;
    }

    addObject<NewT extends Record<string, any>>(obj: NewT | (() => Promise<NewT>)) {
        return this.add(new ObjectDataSource(obj));
    }

    addDictionary<TDic extends Record<string, ConfigurationValue>, TSep extends string = ':'>(dictionary: TDic | (() => Promise<TDic>), hierarchySeparator?: TSep, prefixOrPredicate?: string | Predicate<string>) {
        return this.add<Exclude<InflateDictionary<TDic, TSep>, unknown>>(new DictionaryDataSource(dictionary, hierarchySeparator ?? ':', prefixOrPredicate));
    }

    addEnvironment<TDic extends Record<string, ConfigurationValue>, TPrefix extends string = 'OPT_'>(env: TDic | (() => Promise<TDic>), prefix: string = 'OPT_') {
        // @ts-expect-error InflateDictionary's resulting type, for some reason, always asserts true against "unknown".  TS bug?
        return this.add<InflateDictionary<TDic, '__', TPrefix>>(new EnvironmentDataSource(env, prefix));
    }

    addFetched<NewT extends Record<string, any>>(input: URL | RequestInfo | (() => Promise<URL | RequestInfo>), required: boolean = true, init?: RequestInit, procesFn?: ProcessFetchResponse<NewT>) {
        return this.add<NewT>(new FetchedDataSource(input, required, init, procesFn));
    }

    addJson<NewT extends Record<string, any>>(json: string | (() => Promise<string>), jsonParser?: JSON, reviver?: (this: any, key: string, value: any) => any) {
        return this.add<NewT>(new JsonDataSource(json, jsonParser, reviver));
    }

    addSingleValue<TKey extends string, TValue extends ConfigurationValue, TSep extends string = ':'>(path: TKey | (() => Promise<[TKey, TValue]>), valueOrHierarchySeparator?: TValue | TSep, hierarchySeparator?: TSep) {
        return this.add<InflateKey<TKey, TValue, TSep>>(new SingleValueDataSource<InflateKey<TKey, TValue, TSep>>(path, valueOrHierarchySeparator, typeof path === 'function' ? valueOrHierarchySeparator as string : hierarchySeparator));
    }

    postMerge<U extends Record<string, any> = T>(fn: (config: T) => U | Promise<U>): IBuilder<U> {
        this.#impl.postMerge(fn);
        return this as unknown as IBuilder<U>;
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
        env: IEnvironment<TEnvironments>,
        propertyName: TEnvironmentKey = 'environment' as TEnvironmentKey,
    ) {
        this.#impl._lastCallWasDsAdd = false;
        const envSource: IEnvironmentSource<TEnvironments> = {
            name: propertyName,
            environment: env
        };
        return new EnvAwareBuilder<TEnvironments, Omit<T, TEnvironmentKey> & IncludeEnvironment<TEnvironments, TEnvironmentKey>>(envSource, this.#impl);
    }

    createUrlFunctions<TUrl extends keyof T>(wsPropertyNames: TUrl | TUrl[], routeValuesRegExp?: RegExp) {
        this.#impl.createUrlFunctions(wsPropertyNames, routeValuesRegExp);
        return this as unknown as IBuilder<Omit<T, TUrl> & UrlBuilderSectionWithCheck<T, TUrl>>;
    }

    build(traceValueSources: boolean = false) {
        return this.#impl.build(traceValueSources, p => p()) as unknown as Promise<T>;
    }
};
