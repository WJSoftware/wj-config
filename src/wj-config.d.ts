/**
 * Possible value types in properties of a configuration object.
 */
export type SingleConfigurationValue = string | number | Date | boolean | undefined | null;

/**
 * Defines the type of configuration leaf properties.
 */
export type ConfigurationValue = SingleConfigurationValue | SingleConfigurationValue[];

/**
 * A configuration node.
 */
export interface ConfigurationNode {
    [x: string]: ConfigurationValue | ConfigurationNode
}

/**
 * Types an object-merging operation's result.
 */
export type MergeResult<T extends Record<string, any>, NewT> = (Omit<T, keyof NewT> & {
    [K in keyof NewT]-?: K extends keyof T ?
    (
        T[K] extends Record<string, any> ?
        (NewT[K] extends Record<string, any> ? MergeResult<T[K], NewT[K]> : never) :
        (NewT[K] extends Record<string, any> ? never : T[K] | NewT[K])
    ) : NewT[K]
}) extends infer R ? { [K in keyof R]: R[K] } : never;

/**
 * Types individual dictionary values and inflates them.
 */
export type InflateKey<TKey extends string, TValue extends ConfigurationValue, TSep extends string, TPrefix extends string = ""> = TKey extends `${TPrefix}${infer FullKey}` ?
    FullKey extends `${infer Key}${TSep}${infer Rest}` ?
    {
        [K in Key]: InflateKey<Rest, TValue, TSep>
    } :
    {
        [K in FullKey]: TValue;
    } : {};

/**
 * Inflates entire dictionaries into their corresponding final objects.
 */
export type InflateDictionary<TDic extends Record<string, ConfigurationValue>, TSep extends string, TPrefix extends string = ""> = {
    [K in keyof TDic]: (x: InflateKey<K & string, TDic[K], TSep, TPrefix>) => void
} extends Record<keyof TDic, (x: infer I) => void> ? I : never;

/**
 * Defines the shape of dictionaries.
 */
export type Dictionary = Record<string, ConfigurationValue>;

/**
 * WJ-Config module's entry point.  Creates a builder object that is used to specify the various configuration 
 * sources and settings.
 */
export default function wjConfig(): IBuilder;

/**
 * Predicate function that evaluates an arbitrary number of criteria against the data and returns a judgment in terms 
 * of a Boolean value.
 */
export type Predicate<T> = (data: T) => boolean;

/**
 * Defines functions that process a fetched response object and returns configuration data.
 */
export type ProcessFetchResponse<T extends Record<string, any>> = (response: Response) => Promise<T>;

/**
 * Defines the capabilities of a configurtion object that contains an environment object in the environment property.
 */
export type IncludeEnvironment<TEnvironments extends string, Key extends string = 'environment'> = {
    [K in Key as `${K}`]: IEnvironment<TEnvironments>;
}

/**
 * Defines the requirements of objects that wish to provide JSON-parsing services.
 */
export interface IJsonParser<T extends Record<string, any>> {
    /**
     * Parses the provided JSON string data and returns a JavaScript object.
     * @param json The JSON string to parse.
     */
    parse(json: string): T;
}

/**
 * Defines the capabilities required from data source information objects used in value tracing.
 */
export interface IDataSourceInfo {
    /**
     * Provides the name of the data source instance that can be used in messages and logs.
     */
    name: string;

    /**
     * Index (position) of the data source object in the builder's list of data sources.
     */
    index?: number;
}

/**
 * Defines the capabilities required from data sources.
 */
export interface IDataSource<T extends Record<string, any> = Record<string, any>> extends IDataSourceInfo {
    /**
     * Asynchronously obtains the object that will be used as building block in the creation of the final 
     * configuration object.
     */
    getObject(): Promise<T>;

    /**
     * Returns a data source information object on demand.  This is used when building a configuration object with 
     * value tracing.
     */
    trace(): IDataSourceInfo;
}

/**
 * Defines the shape of configuration-tracing objects.
 */
export interface Trace {
    [x: string]: IDataSourceInfo | Trace;
}

/**
 * Defines the capabilities required from configuration builders.
 */
export interface IBuilder<T extends Record<string, any> = {}> {
    /**
     * Adds the provided data source to the collection of data sources that will be used to build the 
     * configuration object.
     * @param dataSource The data source to include.
     */
    add<NewT extends Record<string, any>>(dataSource: IDataSource<NewT>): IBuilder<MergeResult<T, NewT>>;
    /**
     * Adds the specified object to the collection of data sources that will be used to build the configuration 
     * object.
     * @param obj Data object to include as part of the final configuration data, or a function that returns said 
     * object.
     */
    addObject<NewT extends Record<string, any>>(obj: NewT | (() => Promise<NewT>)): IBuilder<MergeResult<T, NewT>>;
    /**
     * Adds the specified dictionary to the collection of data sources that will be used to build the configuration 
     * object.
     * @param dictionary Dictionary object to include (after processing) as part of the final configuration data, 
     * or a function that returns said object.
     * @param hierarchySeparator Optional hierarchy separator.  If none is specified, a colon (:) is assumed.
     * @param prefix Optional prefix.  Only properties that start with the specified prefix are included, and the 
     * prefix is always removed after the dictionary is processed.  If no prefix is provided, then all dictionary 
     * entries will contribute to the configuration data.
     */
    addDictionary<TDic extends Record<string, ConfigurationValue>, TSep extends string = ':'>(dictionary: TDic | (() => Promise<TDic>), hierarchySeparator?: TSep, prefix?: string): IBuilder<MergeResult<T, InflateDictionary<TDic, TSep>>>;
    /**
     * Adds the specified dictionary to the collection of data sources that will be used to build the configuration 
     * object.
     * @param dictionary Dictionary object to include (after processing) as part of the final configuration data, 
     * or a function that returns said object.
     * @param hierarchySeparator Optional hierarchy separator.  If none is specified, a colon (:) is assumed.
     * @param predicate Optional predicate function that is called for every property in the dictionary.  Only when 
     * the return value of the predicate is true the property is included in configuration.
     */
    addDictionary<TDic extends Record<string, ConfigurationValue>, TSep extends string = ':'>(dictionary: TDic | (() => Promise<TDic>), hierarchySeparator?: TSep, predicate?: Predicate<string | number>): IBuilder<MergeResult<T, InflateDictionary<TDic, TSep>>>;
    /**
     * Adds the qualifying environment variables to the collection of data sources that will be used to build the 
     * configuration object.
     * @param env Environment object containing the environment variables to include in the configuration, or a 
     * function that returns said object.
     * @param prefix Optional prefix.  Only properties that start with the specified prefix are included, and the 
     * prefix is always removed after processing.  To avoid exposing non-application data as configuration, a prefix 
     * is always used.  If none is specified, the default prefix is OPT_.
     */
    addEnvironment<TDic extends Record<string, ConfigurationValue>, TPrefix extends string = 'OPT_'>(env: TDic | (() => Promise<TDic>), prefix?: TPrefix): IBuilder<MergeResult<T, InflateDictionary<TDic, '__', TPrefix>>>;
    /**
     * Adds a fetch operation to the collection of data sources that will be used to build the configuration object.
     * @param url URL to fetch.
     * @param required Optional Boolean value indicating if the fetch must produce an object.
     * @param init Optional fetch init data.  Refer to the fecth() documentation for information.
     * @param processFn Optional processing function that must return the configuration data as an object.
     */
    addFetched<NewT extends Record<string, any>>(url: URL | (() => Promise<URL>), required?: boolean, init?: RequestInit, processFn?: ProcessFetchResponse<NewT>): IBuilder<MergeResult<T, NewT>>;
    /**
     * Adds a fetch operation to the collection of data sources that will be used to build the configuration 
     * object.
     * @param request Request object to use when fetching.  Refer to the fetch() documentation for information.
     * @param required Optional Boolean value indicating if the fetch must produce an object.
     * @param init Optional fetch init data.  Refer to the fecth() documentation for information.
     * @param processFn Optional processing function that must return the configuration data as an object.
     */
    addFetched<NewT extends Record<string, any>>(request: RequestInfo | (() => Promise<RequestInfo>), required?: boolean, init?: RequestInit, processFn?: ProcessFetchResponse<NewT>): IBuilder<MergeResult<T, NewT>>;
    /**
     * Adds the specified JSON string to the collection of data sources that will be used to build the 
     * configuration object.
     * @param json The JSON string to parse into a JavaScript object, or a function that returns said string.
     * @param jsonParser Optional JSON parser.  If not specified, the built-in JSON object will be used.
     * @param reviver Optional reviver function.  For more information see the JSON.parse() documentation.
     */
    addJson<NewT extends Record<string, any>>(json: string | (() => Promise<string>), jsonParser?: IJsonParser<NewT>, reviver?: (this: any, key: string, value: any) => any): IBuilder<MergeResult<T, NewT>>;
    /**
     * Adds a single value to the collection of data sources that will be used to build the configuration object.
     * @param path Key comprised of names that determine the hierarchy of the value.
     * @param value Value of the property.
     * @param hierarchySeparator Optional hierarchy separator.  If not specified, colon (:) is assumed.
     */
    addSingleValue<TKey extends string, TValue extends ConfigurationValue, TSep extends string = ':'>(path: TKey, value?: TValue, hierarchySeparator?: TSep): IBuilder<MergeResult<T, InflateKey<TKey, TValue, TSep>>>;
    /**
     * Adds a single value to the collection of data sources that will be used to build the configuration object.
     * @param dataFn Function that returns the [key, value] tuple that needs to be added.
     * @param hierarchySeparator Optional hierarchy separator.  If not specified, colon (:) is assumed.
     */
    addSingleValue<TKey extends string, TValue extends ConfigurationValue, TSep extends string = ':'>(dataFn: () => Promise<readonly [TKey, TValue]>, hierarchySeparator?: TSep): IBuilder<MergeResult<T, InflateKey<TKey, TValue, TSep>>>;
    /**
     * Sets the data source name of the last data source added to the builder.
     * @param name Name for the data source.
     */
    name(name: string): IBuilder<T>;
    /**
     * Makes the last-added data source conditionally inclusive.
     * @param predicate Predicate function that is run whenever the build function runs.  If the predicate returns 
     * true, then the data source will be included; if it returns false, then the data source is skipped.
     * @param dataSourceName Optional data source name.  Provided to simplify the build chain and is merely a 
     * shortcut to include a call to the name() function.  Equivalent to when().name().
     */
    when(predicate: () => boolean, dataSourceName?: string): IBuilder<T>;
    /**
    * Adds the provided environment object as a property of the final configuration object.
    * @param env Previously created environment object.
    * @param propertyName Optional property name for the environment object.
    */
    includeEnvironment<TEnvironments extends string, TEnvironmentKey extends string = "environment">(
        env: IEnvironment<TEnvironments>,
        propertyName?: TEnvironmentKey
    ): IEnvAwareBuilder<TEnvironments, Omit<T, TEnvironmentKey> & IncludeEnvironment<TEnvironments, TEnvironmentKey>>;
    /**
     * Creates URL functions in the final configuration object for URL's defined according to the wj-config standard.
     * @param wsPropertyNames Optional list of property names whose values are expected to be objects that contain 
     * host, port, scheme or root path data at some point in their child hierarchy.  If not provided, then the default 
     * list will be used.  It can also be a single string, which is the same as a 1-element array.
     * @param routeValueRegExp Optional regular expression used to identify replaceable route values.  If this is not 
     * provided, then the default regular expression will match route values of the form {<route value name>}, such as 
     * {code} or {id}.
     */
    createUrlFunctions<TUrl extends keyof T>(wsPropertyNames: TUrl | TUrl[], routeValueRegExp?: RegExp): IBuilder<Omit<T, TUrl> & UrlBuilderSectionWithCheck<T, TUrl>>;
    /**
     * Asynchronously builds the final configuration object.
     */
    build(traceValueSources?: boolean): Promise<T>;
    /**
     * Defines a post-merge operation.  Post-merge operations are run after all the data sources have been merged and 
     * after all URL functions have been created, and allow the developer to perform additional processing on the final 
     * configuration object.
     * 
     * Any number of post-merge operations can be defined; these are run in the order they are provided, each being fed 
     * the configuration object that the previous post-merge operation returns.
     * 
     * This is useful for things like creating composite values.  The use-case that inspired this feature is the 
     * creation of scopes for Azure SSO.
     * 
     * @example
     * 
     * A configuration JSON file containing SSO configuration might look like this:
     * 
     * ```json
     * {
     *   "sso": {
     *     "auth": {
     *       "clientId": "12345678-1234-1234-1234-123456789012",
     *       "redirectUri": "/",
     *       "authority": "https://login.microsoftonline.com/common",
     *       "clientCapabilities": [ "CP1" ]
     *     },
     *     "scopes": [ "some.api.access" ]
*        }
     * }
     * ```
     * 
     * Scopes are usually in the form `"api://{clientId}/{scope}"`, so the post-merge function can be used to replace 
     * the scopes in the config JSON file with scopes of the above form.  The advantage over just typing them already 
     * in this format?  You don't have to repeat the client ID on every scope.  We are all about DRY configuration.
     * 
     * ```ts
     * export default await wjConfig()
     *     ...
     *     .postMerge(c => c.sso.scopes = c.sso.scopes.map(s => `api://${c.sso.auth.clientId}/${s}`))
     *     .build();
     * ```
     * 
     * @param fn Function that receives the (otherwise) final configuration object and allows the developer to perform 
     * additional processing on it.  The function must return the modified object, which is passed to the next post 
     * merge function.
     */
    postMerge<U extends Record<string, any> = T>(fn: (config: T) => U | Promise<U>): IBuilder<U>;
}

export interface IEnvAwareBuilder<TEnvironments extends string, T extends Record<string, any> = {}> {
    /**
     * Adds the provided data source to the collection of data sources that will be used to build the 
     * configuration object.
     * @param dataSource The data source to include.
     */
    add<NewT extends Record<string, any>>(dataSource: IDataSource<NewT>): IEnvAwareBuilder<TEnvironments, MergeResult<T, NewT>>;
    /**
     * Adds the specified object to the collection of data sources that will be used to build the configuration object.
     * @param obj Data object to include as part of the final configuration data, or a function that returns said 
     * object.
     */
    addObject<NewT extends Record<string, any>>(obj: NewT | (() => Promise<NewT>)): IEnvAwareBuilder<TEnvironments, MergeResult<T, NewT>>;
    /**
     * Adds the specified dictionary to the collection of data sources that will be used to build the configuration 
     * object.
     * @param dictionary Dictionary object to include (after processing) as part of the final configuration data, 
     * or a function that returns said object.
     * @param hierarchySeparator Optional hierarchy separator.  If none is specified, a colon (:) is assumed.
     * @param prefix Optional prefix.  Only properties that start with the specified prefix are included, and the 
     * prefix is always removed after the dictionary is processed.  If no prefix is provided, then all dictionary 
     * entries will contribute to the configuration data.
     */
    addDictionary<TDic extends Record<string, ConfigurationValue>, TSep extends string = ':'>(dictionary: Record<string, ConfigurationValue> | (() => Promise<Record<string, ConfigurationValue>>), hierarchySeparator?: string, prefix?: string): IEnvAwareBuilder<TEnvironments, MergeResult<T, InflateDictionary<TDic, TSep>>>;
    /**
     * Adds the specified dictionary to the collection of data sources that will be used to build the configuration 
     * object.
     * @param dictionary Dictionary object to include (after processing) as part of the final configuration data, 
     * or a function that returns said object.
     * @param hierarchySeparator Optional hierarchy separator.  If none is specified, a colon (:) is assumed.
     * @param predicate Optional predicate function that is called for every property in the dictionary.  Only when 
     * the return value of the predicate is true the property is included in configuration.
     */
    addDictionary<TDic extends Record<string, ConfigurationValue>, TSep extends string = ':'>(dictionary: Record<string, ConfigurationValue> | (() => Promise<Record<string, ConfigurationValue>>), hierarchySeparator?: string, predicate?: Predicate<string>): IEnvAwareBuilder<TEnvironments, MergeResult<T, InflateDictionary<TDic, TSep>>>;
    /**
     * Adds the qualifying environment variables to the collection of data sources that will be used to build the 
     * configuration object.
     * @param env Environment object containing the environment variables to include in the configuration, or a 
     * function that returns said object.
     * @param prefix Optional prefix.  Only properties that start with the specified prefix are included, and the 
     * prefix is always removed after processing.  To avoid exposing non-application data as configuration, a prefix 
     * is always used.  If none is specified, the default prefix is OPT_.
     */
    addEnvironment<TDic extends Record<string, ConfigurationValue>, TPrefix extends string = 'OPT_'>(env: TDic | (() => Promise<TDic>), prefix?: TPrefix): IEnvAwareBuilder<TEnvironments, MergeResult<T, InflateDictionary<TDic, '__', TPrefix>>>;
    /**
     * Adds a fetch operation to the collection of data sources that will be used to build the configuration object.
     * @param url URL to fetch.
     * @param required Optional Boolean value indicating if the fetch must produce an object.
     * @param init Optional fetch init data.  Refer to the fecth() documentation for information.
     * @param processFn Optional processing function that must return the configuration data as an object.
     */
    addFetched<NewT extends Record<string, any>>(url: URL | (() => Promise<URL>), required?: boolean, init?: RequestInit, processFn?: ProcessFetchResponse<NewT>): IEnvAwareBuilder<TEnvironments, MergeResult<T, NewT>>;
    /**
     * Adds a fetch operation to the collection of data sources that will be used to build the configuration 
     * object.
     * @param request Request object to use when fetching.  Refer to the fetch() documentation for information.
     * @param required Optional Boolean value indicating if the fetch must produce an object.
     * @param init Optional fetch init data.  Refer to the fecth() documentation for information.
     * @param processFn Optional processing function that must return the configuration data as an object.
     */
    addFetched<NewT extends Record<string, any>>(request: RequestInfo | (() => Promise<RequestInfo>), required?: boolean, init?: RequestInit, processFn?: ProcessFetchResponse<NewT>): IEnvAwareBuilder<TEnvironments, MergeResult<T, NewT>>;
    /**
     * Adds the specified JSON string to the collection of data sources that will be used to build the 
     * configuration object.
     * @param json The JSON string to parse into a JavaScript object, or a function that returns said string.
     * @param jsonParser Optional JSON parser.  If not specified, the built-in JSON object will be used.
     * @param reviver Optional reviver function.  For more information see the JSON.parse() documentation.
     */
    addJson<NewT extends Record<string, any>>(json: string | (() => Promise<string>), jsonParser?: IJsonParser<NewT>, reviver?: (this: any, key: string, value: any) => any): IEnvAwareBuilder<TEnvironments, MergeResult<T, NewT>>;
    /**
     * Adds a single value to the collection of data sources that will be used to build the configuration object.
     * @param path Key comprised of names that determine the hierarchy of the value.
     * @param value Value of the property.
     * @param hierarchySeparator Optional hierarchy separator.  If not specified, colon (:) is assumed.
     */
    addSingleValue<TKey extends string, TValue extends ConfigurationValue, TSep extends string = ':'>(path: TKey, value?: TValue, hierarchySeparator?: string): IEnvAwareBuilder<TEnvironments, MergeResult<T, InflateKey<TKey, TValue, TSep>>>;
    /**
     * Adds a single value to the collection of data sources that will be used to build the configuration object.
     * @param dataFn Function that returns the [key, value] tuple that needs to be added.
     * @param hierarchySeparator Optional hierarchy separator.  If not specified, colon (:) is assumed.
     */
    addSingleValue<TKey extends string, TValue extends ConfigurationValue, TSep extends string = ':'>(dataFn: () => Promise<[TKey, TValue]>, hierarchySeparator?: string): IEnvAwareBuilder<TEnvironments, MergeResult<T, InflateKey<TKey, TValue, TSep>>>;
    /**
     * Sets the data source name of the last data source added to the builder.
     * @param name Name for the data source.
     */
    name(name: string): IEnvAwareBuilder<TEnvironments, T>;
    /**
     * Special function that allows the developer the opportunity to add one data source per defined environment.
     * 
     * The function iterates through all possible environments and calls the addDs function for each one.  It is 
     * assumed that the addDs function will add zero or one data source.  To signal no data source was added, 
     * addDs must return the boolean value "false".
     * @param addDs Function that is meant to add a single data source of any type that is associated to the 
     * provided environment name.
     */
    addPerEnvironment<NewT extends Record<string, any> = {}>(addDs: (builder: IEnvAwareBuilder<TEnvironments, T>, envName: TEnvironments) => boolean | string): IEnvAwareBuilder<TEnvironments, MergeResult<T, NewT>>;
    /**
     * Makes the last-added data source conditionally inclusive.
     * @param predicate Predicate function that is run whenever the build function runs.  If the predicate returns 
     * true, then the data source will be included; if it returns false, then the data source is skipped.
     * @param dataSourceName Optional data source name.  Provided to simplify the build chain and is merely a 
     * shortcut to include a call to the name() function.  Equivalent to when().name().
     */
    when(predicate: Predicate<IEnvironment<TEnvironments> | undefined>, dataSourceName?: string): IEnvAwareBuilder<TEnvironments, T>;
    /**
     * Makes the last-added data source conditionally included only if the current environment possesses all of 
     * the listed traits.
     * @param traits The traits the current environment must have for the data source to be added.
     * @param dataSourceName Optional data source name.  Provided to simplify the build chain and is merely a 
     * shortcut to include a call to the name() function.  Equivalent to whenAllTraits().name().
     */
    whenAllTraits(traits: Traits, dataSourceName?: string): IEnvAwareBuilder<TEnvironments, T>;
    /**
     * Makes the last-added data source conditionally included if the current environment possesses any of the 
     * listed traits.  Only one coincidence is necessary.
     * @param traits The list of possible traits the current environment may have in order for the data source to 
     * be included.
     * @param dataSourceName Optional data source name.  Provided to simplify the build chain and is merely a 
     * shortcut to include a call to the name() function.  Equivalent to whenAnyTrait().name().
     */
    whenAnyTrait(traits: Traits, dataSourceName?: string): IEnvAwareBuilder<TEnvironments, T>;
    /**
     * Makes the last-added data source conditionally included if the current environment's name is equal to the 
     * provided environment name.
     * @param envName The environment name to use to conditionally include the last-added data source.
     * @param dataSourceName Optional data source name.  Provided to simplify the build chain and is 
     * merely a shortcut to include a call to the name() function.
     */
    forEnvironment(envName: TEnvironments, dataSourceName?: string): IEnvAwareBuilder<TEnvironments, T>;
    /**
     * Creates URL functions in the final configuration object for URL's defined according to the wj-config standard.
     * @param wsPropertyNames Optional list of property names whose values are expected to be objects that contain 
     * host, port, scheme or root path data at some point in their child hierarchy.  If not provided, then the default 
     * list will be used.  It can also be a single string, which is the same as a 1-element array.
     * @param routeValueRegExp Optional regular expression used to identify replaceable route values.  If this is not 
     * provided, then the default regular expression will match route values of the form {<route value name>}, such as 
     * {code} or {id}.
     */
    createUrlFunctions<TUrl extends keyof T>(wsPropertyNames: TUrl | TUrl[], routeValueRegExp?: RegExp): IEnvAwareBuilder<TEnvironments, Omit<T, TUrl> & UrlBuilderSectionWithCheck<T, TUrl>>;
    /**
     * Asynchronously builds the final configuration object.
     */
    build(traceValueSources?: boolean, enforcePerEnvironmentCoverage?: boolean): Promise<T>;
    /**
     * Defines a post-merge operation.  Post-merge operations are run after all the data sources have been merged and 
     * after all URL functions have been created, and allow the developer to perform additional processing on the final 
     * configuration object.
     * 
     * Any number of post-merge operations can be defined; these are run in the order they are provided, each being fed 
     * the configuration object that the previous post-merge operation returns.
     * 
     * This is useful for things like creating composite values.  The use-case that inspired this feature is the 
     * creation of scopes for Azure SSO.
     * 
     * @example
     * 
     * A configuration JSON file containing SSO configuration might look like this:
     * 
     * ```json
     * {
     *   "sso": {
     *     "auth": {
     *       "clientId": "12345678-1234-1234-1234-123456789012",
     *       "redirectUri": "/",
     *       "authority": "https://login.microsoftonline.com/common",
     *       "clientCapabilities": [ "CP1" ]
     *     },
     *     "scopes": [ "some.api.access" ]
*        }
     * }
     * ```
     * 
     * Scopes are usually in the form `"api://{clientId}/{scope}"`, so the post-merge function can be used to replace 
     * the scopes in the config JSON file with scopes of the above form.  The advantage over just typing them already 
     * in this format?  You don't have to repeat the client ID on every scope.  We are all about DRY configuration.
     * 
     * ```ts
     * export default await wjConfig()
     *     ...
     *     .postMerge(c => c.sso.scopes = c.sso.scopes.map(s => `api://${c.sso.auth.clientId}/${s}`))
     *     .build();
     * ```
     * 
     * @param fn Function that receives the (otherwise) final configuration object and allows the developer to perform 
     * additional processing on it.  The function must return the modified object, which is passed to the next post 
     * merge function.
     */
    postMerge<U extends Record<string, any> = T>(fn: (config: T) => U | Promise<U>): IEnvAwareBuilder<TEnvironments, U>;
}

/**
 * Function type that allows environment objects to declare testing functions, such as isProduction().
 */
export type EnvironmentTestFn = () => boolean;

/**
 * Defines the capabilities required from environment objects.
 */
export type IEnvironment<TEnvironments extends string> = {
    [K in TEnvironments as `is${Capitalize<K>}`]: EnvironmentTestFn;
} & {
    /**
     * The current environment (represented by an environment definition).
     */
    readonly current: IEnvironmentDefinition<Exclude<TEnvironments, undefined>>;

    /**
     * The list of known environments (represented by a list of environment definitions).
     */
    readonly all: TEnvironments[];

    /**
     * Tests the current environment definition for the presence of the specified traits.  It will return true 
     * only if all specified traits are present; othewise it will return false.
     * @param traits The environment traits expected to be found in the current environment definition.
     */
    hasTraits(traits: Traits): boolean;

    /**
     * Tests the current environment definition for the presence of any of the specified traits.  It will return 
     * true if any of the specified traits is present.  If none of the specified traits are present, then the 
     * return value will be false.
     * @param traits The environments traits of which at least on of them is expected to be found in the current 
     * environment definition.
     */
    hasAnyTrait(traits: Traits): boolean;
}

/**
 * Type used to determine if a configuration node is an appropriate URL root node.
 */
export type HasHost = {
    host: string;
}

/**
 * Type used to determine if a configuration node holds path information.
 */
export type HasRootPath = {
    rootPath: string;
}

/**
 * Defines the reserved property names for the URL-building feature of the builders.
 */
export type UrlSectionReserved = {
    host?: string;
    port?: number;
    scheme?: string;
    rootPath?: string;
};

/**
 * Type of function used as route values when calling a URL-building function.
 */
export type RouteValuesFn = (name: string) => any;

/**
 * Defines the acceptable route value replacement types.
 */
export type RouteReplacementArg = Record<string, any> | any[] | RouteValuesFn;

/**
 * Defines the acceptable query string argument types.
 */
export type QueryStringArg = Record<string, any> | string | (() => string | Record<string, any>);

/**
 * Defines the shape of the dynamically-created URL-building functions.
 */
export type UrlBuilderFn = (routeValues?: RouteReplacementArg, queryString?: QueryStringArg) => string;

/**
 * Defines the signature of the `buildUrl` functions that get created in the configuration object when using the 
 * builder's `createUrlFunctions()` method.
 * @param path The extra path to add to the built URL.
 * @param routeValues Optional argument used to perform route value replacement.
 * @param queryString Optional argument used to append query string data to the generated URL.
 */
export type BuildUrlFn = (path: string, routeValues?: RouteReplacementArg, queryString?: QueryStringArg) => string;

/**
 * Defines the shape of nodes in the configuration object that have been successfully processed and converted to 
 * provide URL-building functions.
 */
export type UrlNode = Partial<HasRootPath> & {
    buildUrl: BuildUrlFn;
    /**
     * Calculates the accumulated root path for this node.
     * @returns The accumulated root path for this node as a string.
     */
    _rootPath: () => string;
} & {
    [x: string]: UrlBuilderFn;
};

export type UrlRoot = UrlSectionReserved & UrlNode;

/**
 * Defines how url-building sections of the configuration are transformed by `createUrlFunctions()`.
 */
export type UrlBuilderSection<T, TUrl extends keyof T> = {
    buildUrl: (extraPath: string, routeValues?: RouteReplacementArg, queryString?: QueryStringArg) => string;
} & {
    [K in TUrl]: K extends keyof UrlSectionReserved ? UrlSectionReserved[K] :
    K extends `_${string}` ? T[K] :
    T[K] extends string ? UrlBuilderFn :
    T[K] extends Record<string, any> ? UrlBuilderSection<T[K], keyof T[K]> :
    T[K]
};

/**
 * Defines how url-building sections of the configuration are transformed by `createUrlFunctions()` while traversing the 
 * configuration tree in the looks for `rootPath` or `host`.
 */
export type UrlBuilderSectionWithCheck<T, TUrl extends keyof T> = T extends HasHost ?
    UrlBuilderSection<T, TUrl> :
    T extends HasRootPath ?
    UrlBuilderSection<T, TUrl> :
    T extends Record<string, any> ?
    {
        [K in TUrl]: UrlBuilderSectionWithCheck<T[K], keyof T[K]>
    }
    : T;

/**
 * Type that defines the acceptable trait types for a single trait.  It is encouraged to use number-based traits.
 */
export type Trait = number | string;

/**
 * Type that defines the acceptable trait types for multiple traits.  It is encouraged to use number-based traits.
 */
export type Traits = number | string[];

/**
 * Defines the capabilities required from objects used as environment definitions.
 */
export interface IEnvironmentDefinition<TEnvironments extends string> {

    /**
     * Gets the environment's name.
     */
    readonly name: TEnvironments,

    /**
     * Gets the environment's traits.
     */
    readonly traits: Traits
}

/**
 * Utility type that extracts the environment names from a constant list of possible names.
 * 
 * @example
 * ```ts
 * const envs = ['Development', 'Staging', 'Production'] as const;
 * type EnvName = EnvironmentName<typeof envs>; // 'Development' | 'Staging' | 'Production'
 * 
 * const env = buildEnvironment(process.env.NODE_ENV as EnvName, envs);
 * env.isDevelopment(); // true if the current environment is 'Development'
 * env.isStaging(); // true if the current environment is 'Staging'
 * env.isProduction(); // true if the current environment is 'Production'
 * ```
 * 
 * Without the type casting (`as EnvName`), the `isXXX()` functions would not show up in Intellisense, as the type of 
 * `env` would be`IEnvironment<string>`.
 */
export type EnvironmentName<T extends readonly string[]> = T[number];
