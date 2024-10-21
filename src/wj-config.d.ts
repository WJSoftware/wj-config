/**
 * Possible values in a configuration object.
 */
export type SingleConfigurationValue = string | number | Date | boolean | undefined | null;

export type ConfigurationValue = SingleConfigurationValue | SingleConfigurationValue[];

/**
 * A configuration node.
 */
export interface ConfigurationNode {
    [x: string]: ConfigurationValue | ConfigurationNode
}

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

export interface IJsonParser<T extends Record<string, any>> {
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

export interface Trace {
    [x: string]: IDataSourceInfo | Trace;
}


/**
 * Defines the capabilities required from configuration builders.
 */
export interface IBuilder<T extends Record<string, any> = {}, TEnvironments extends string | undefined = undefined> {
    /**
     * Adds the provided data source to the collection of data sources that will be used to build the 
     * configuration object.
     * @param dataSource The data source to include.
     */
    add<NewT extends Record<string, any>>(dataSource: IDataSource<NewT>): IBuilder<Omit<T, keyof NewT> & NewT, TEnvironments>;
    /**
     * Adds the specified object to the collection of data sources that will be used to build the configuration 
     * object.
     * @param obj Data object to include as part of the final configuration data, or a function that returns said 
     * object.
     */
    addObject<NewT extends Record<string, any>>(obj: NewT | (() => Promise<NewT>)): IBuilder<Omit<T, keyof NewT> & NewT, TEnvironments>;
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
    addDictionary<NewT extends Record<string, any>>(dictionary: Record<string, ConfigurationValue> | (() => Promise<Record<string, ConfigurationValue>>), hierarchySeparator?: string, prefix?: string): IBuilder<Omit<T, keyof NewT> & NewT, TEnvironments>;
    /**
     * Adds the specified dictionary to the collection of data sources that will be used to build the configuration 
     * object.
     * @param dictionary Dictionary object to include (after processing) as part of the final configuration data, 
     * or a function that returns said object.
     * @param hierarchySeparator Optional hierarchy separator.  If none is specified, a colon (:) is assumed.
     * @param predicate Optional predicate function that is called for every property in the dictionary.  Only when 
     * the return value of the predicate is true the property is included in configuration.
     */
    addDictionary<NewT extends Record<string, any>>(dictionary: Record<string, ConfigurationValue> | (() => Promise<Record<string, ConfigurationValue>>), hierarchySeparator?: string, predicate?: Predicate<string>): IBuilder<Omit<T, keyof NewT> & NewT, TEnvironments>;
    /**
     * Adds the qualifying environment variables to the collection of data sources that will be used to build the 
     * configuration object.
     * @param env Environment object containing the environment variables to include in the configuration, or a 
     * function that returns said object.
     * @param prefix Optional prefix.  Only properties that start with the specified prefix are included, and the 
     * prefix is always removed after processing.  To avoid exposing non-application data as configuration, a prefix 
     * is always used.  If none is specified, the default prefix is OPT_.
     */
    addEnvironment<NewT extends Record<string, any>>(env: Record<string, ConfigurationValue> | (() => Promise<Record<string, ConfigurationValue>>), prefix?: string): IBuilder<Omit<T, keyof NewT> & NewT, TEnvironments>;
    /**
     * Adds a fetch operation to the collection of data sources that will be used to build the configuration object.
     * @param url URL to fetch.
     * @param required Optional Boolean value indicating if the fetch must produce an object.
     * @param init Optional fetch init data.  Refer to the fecth() documentation for information.
     * @param processFn Optional processing function that must return the configuration data as an object.
     */
    addFetched<NewT extends Record<string, any>>(url: URL | (() => Promise<URL>), required?: boolean, init?: RequestInit, processFn?: ProcessFetchResponse<NewT>): IBuilder<Omit<T, keyof NewT> & NewT, TEnvironments>;
    /**
     * Adds a fetch operation to the collection of data sources that will be used to build the configuration 
     * object.
     * @param request Request object to use when fetching.  Refer to the fetch() documentation for information.
     * @param required Optional Boolean value indicating if the fetch must produce an object.
     * @param init Optional fetch init data.  Refer to the fecth() documentation for information.
     * @param processFn Optional processing function that must return the configuration data as an object.
     */
    addFetched<NewT extends Record<string, any>>(request: RequestInfo | (() => Promise<RequestInfo>), required?: boolean, init?: RequestInit, processFn?: ProcessFetchResponse<NewT>): IBuilder<Omit<T, keyof NewT> & NewT, TEnvironments>;
    /**
     * Adds the specified JSON string to the collection of data sources that will be used to build the 
     * configuration object.
     * @param json The JSON string to parse into a JavaScript object, or a function that returns said string.
     * @param jsonParser Optional JSON parser.  If not specified, the built-in JSON object will be used.
     * @param reviver Optional reviver function.  For more information see the JSON.parse() documentation.
     */
    addJson<NewT extends Record<string, any>>(json: string | (() => Promise<string>), jsonParser?: IJsonParser<NewT>, reviver?: (this: any, key: string, value: any) => any): IBuilder<Omit<T, keyof NewT> & NewT, TEnvironments>;
    /**
     * Adds a single value to the collection of data sources that will be used to build the configuration object.
     * @param path Key comprised of names that determine the hierarchy of the value.
     * @param value Value of the property.
     * @param hierarchySeparator Optional hierarchy separator.  If not specified, colon (:) is assumed.
     */
    addSingleValue<NewT extends Record<string, any>>(path: string, value?: ConfigurationValue, hierarchySeparator?: string): IBuilder<Omit<T, keyof NewT> & NewT, TEnvironments>;
    /**
     * Adds a single value to the collection of data sources that will be used to build the configuration object.
     * @param dataFn Function that returns the [key, value] tuple that needs to be added.
     * @param hierarchySeparator Optional hierarchy separator.  If not specified, colon (:) is assumed.
     */
    addSingleValue<NewT extends Record<string, any>>(dataFn: () => Promise<[string, ConfigurationValue]>, hierarchySeparator?: string): IBuilder<Omit<T, keyof NewT> & NewT, TEnvironments>;
    /**
     * Special function that allows the developer the opportunity to add one data source per defined environment.
     * 
     * The function iterates through all possible environments and calls the addDs function for each one.  It is 
     * assumed that the addDs function will add zero or one data source.  To signal no data source was added, 
     * addDs must return the boolean value "false".
     * @param addDs Function that is meant to add a single data source of any type that is associated to the 
     * provided environment name.
     */
    addPerEnvironment<NewT extends Record<string, any>>(addDs: (builder: IBuilder<T, TEnvironments>, envName: TEnvironments) => boolean | string): IBuilder<Omit<T, keyof NewT> & NewT, TEnvironments>;
    /**
     * Sets the data source name of the last data source added to the builder.
     * @param name Name for the data source.
     */
    name(name: string): IBuilder<T, TEnvironments>;
    /**
     * Makes the last-added data source conditionally inclusive.
     * @param predicate Predicate function that is run whenever the build function runs.  If the predicate returns 
     * true, then the data source will be included; if it returns false, then the data source is skipped.
     * @param dataSourceName Optional data source name.  Provided to simplify the build chain and is merely a 
     * shortcut to include a call to the name() function.  Equivalent to when().name().
     */
    when(predicate: Predicate<IEnvironment<Exclude<TEnvironments, undefined>> | undefined>, dataSourceName?: string): IBuilder<T, TEnvironments>;
    /**
     * Makes the last-added data source conditionally included only if the current environment possesses all of 
     * the listed traits.
     * @param traits The traits the current environment must have for the data source to be added.
     * @param dataSourceName Optional data source name.  Provided to simplify the build chain and is merely a 
     * shortcut to include a call to the name() function.  Equivalent to whenAllTraits().name().
     */
    whenAllTraits(traits: Traits, dataSourceName?: string): IBuilder<T, TEnvironments>;
    /**
     * Makes the last-added data source conditionally included if the current environment possesses any of the 
     * listed traits.  Only one coincidence is necessary.
     * @param traits The list of possible traits the current environment may have in order for the data source to 
     * be included.
     * @param dataSourceName Optional data source name.  Provided to simplify the build chain and is merely a 
     * shortcut to include a call to the name() function.  Equivalent to whenAnyTrait().name().
     */
    whenAnyTrait(traits: Traits, dataSourceName?: string): IBuilder<T, TEnvironments>;
    /**
     * Makes the last-added data source conditionally included if the current environment's name is equal to the 
     * provided environment name.
     * @param envName The environment name to use to conditionally include the last-added data source.
     * @param dataSourceName Optional data source name.  Provided to simplify the build chain and is 
     * merely a shortcut to include a call to the name() function.
     */
    forEnvironment(envName: Exclude<TEnvironments, undefined>, dataSourceName?: string): IBuilder<T, TEnvironments>;
    /**
    * Adds the provided environment object as a property of the final configuration object.
    * @param env Previously created environment object.
    * @param propertyName Optional property name for the environment object.
    */
    includeEnvironment<TEnvironmentKey extends string = "environment">(env: IEnvironment<Exclude<TEnvironments, undefined>>, propertyName?: TEnvironmentKey): IBuilder<Omit<T, TEnvironmentKey> & IncludeEnvironment<TEnvironmentKey>, TEnvironments>;
    /**
     * Adds an environment object created with the provided value and names as a property of the final configuration 
     * object.
     * @param value Current environment name.
     * @param envNames List of possible environment names.
     * @param propertyName Optional property name for the environment object.
     */
    includeEnvironment<TEnvironmentKey extends string = "environment">(value: Exclude<TEnvironments, undefined>, envNames?: TEnvironments[], propertyName?: TEnvironmentKey): IBuilder<Omit<T, TEnvironmentKey> & IncludeEnvironment<TEnvironmentKey>, TEnvironments>;
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
    build(traceValueSources?: boolean, enforcePerEnvironmentCoverage?: boolean): Promise<T>;
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

export type HasHost = {
    host: string;
}

export type HasRootPath = {
    rootPath: string;
}

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

export type BuildUrlFn = (path: string, routeValues?: RouteReplacementArg, queryString?: QueryStringArg) => string;

export type UrlNode = Partial<HasRootPath> & {
    buildUrl: BuildUrlFn;
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
 * Builds an environment object with the provided environment information.
 * @param currentEnvironment The application's current environment.
 * @param possibleEnvironments The complete list of all possible environments.
 */
export declare function buildEnvironment<TEnvironments extends string>(
    currentEnvironment: string | IEnvironmentDefinition<TEnvironments>,
    possibleEnvironments?: TEnvironments[]
): IEnvironment<TEnvironments>;

/**
 * Environment definition class used to specify the current environment as an object.
 */
export class EnvironmentDefinition {
    public readonly name: string;
    public readonly traits: Traits;
    /**
     * Initializes a new instance of this class.
     * @param name The name of the current environment.
     * @param traits The traits assigned to the current environment.
     */
    constructor(name: string, traits?: Traits);
}

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
