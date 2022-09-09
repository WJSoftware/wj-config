declare module 'wj-config' {
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
     * Possible values in a configuration object.
     */
    export type ConfigurationValue = string | number | Date | boolean | IEnvironment | IDefaultEnvironment | undefined | null | Function | ICoreConfig | IDataSourceInfo;

    /**
     * Type alias that describes the data type of interim or final configuration objects.
     */
    export type IConfig = ICoreConfig | IEnvConfig | IDefaultEnvConfig;

    export type ProcessFetchResponse = (response: Response) => Promise<ICoreConfig>;

    /**
     * Defines the core and most basic capabilities found in configuration objects.
     */
    export interface ICoreConfig {
        [x: string | symbol]: ConfigurationValue;
    }

    /**
     * Defines the capabilities of a configurtion object that contains an environment object in the environment property.
     */
    export interface IEnvConfig extends ICoreConfig {
        environment: IEnvironment;
    }

    /**
     * Defines the capabilities of a configurtion object that contains an environment object in the environment property 
     * created using the default list of environment names.
     */
    export interface IDefaultEnvConfig extends ICoreConfig {
        environment: IDefaultEnvironment
    }

    export interface IJsonParser {
        parse(json: string): ICoreConfig
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
    export interface IDataSource extends IDataSourceInfo {
        /**
         * Asynchronously obtains the object that will be used as building block in the creation of the final 
         * configuration object.
         */
        getObject(): Promise<ICoreConfig>;

        /**
         * Returns a data source information object on demand.  This is used when building a configuration object with 
         * value tracing.
         */
        trace(): IDataSourceInfo;
    }

    /**
     * Defines the capabilities required from configuration builders.
     */
    export interface IBuilder {
        /**
         * Adds the provided data source to the collection of data sources that will be used to build the configuration 
         * object.
         * @param dataSource The data source to include.
         */
        add(dataSource: IDataSource): IBuilder;
        /**
         * Adds the specified object to the collection of data sources that will be used to build the configuration object.
         * @param obj Data object to include as part of the final configuration data.
         */
        addObject(obj: IConfig): IBuilder;

        /**
         * Adds the specified dictionary to the collection of data sources that will be used to build the configuration 
         * object.
         * @param dictionary Dictionary object to include (after processing) as part of the final configuration data.
         * @param hierarchySeparator Optional hierarchy separator.  If none is specified, a colon (:) is assumed.
         * @param prefix Optional prefix.  Only properties that start with the specified prefix are included, and the 
         * prefix is always removed after the dictionary is processed.  If no prefix is provided, then all dictionary 
         * entries will contribute to the configuration data.
         */
        addDictionary(dictionary: IConfig, hierarchySeparator?: string, prefix?: string): IBuilder;

        /**
         * 
         * @param dictionary Dictionary object to include (after processing) as part of the final configuration data.
         * @param hierarchySeparator Optional hierarchy separator.  If none is specified, a colon (:) is assumed.
         * @param predicate Optional predicate function that is called for every property in the dictionary.  Only when 
         * the return value of the predicate is true the property is included in configuration.
         */
        addDictionary(dictionary: IConfig, hierarchySeparator?: string, predicate?: Predicate<string>): IBuilder;

        /**
         * Adds the qualifying environment variables to the collection of data sources that will be used to build the 
         * configuration object.
         * @param env Environment object containing the environment variables to include in the configuration.
         * @param prefix Optional prefix.  Only properties that start with the specified prefix are included, and the 
         * prefix is always removed after processing.  To avoid exposing non-application data as configuration, a prefix 
         * is always used.  If none is specified, the default prefix is OPT_.
         */
        addEnvironment(env: IConfig, prefix?: string): IBuilder;

        /**
         * Adds a fetch operation to the collection of data sources that will be used to build the configuration 
         * object.
         * @param url URL to fetch.
         * @param required Optional Boolean value indicating if the fetch must produce an object.
         * @param init Optional fetch init data.  Refer to the fecth() documentation for information.
         * @param procesFn Optional processing function that must return the configuration data as an object.
         */
        addFetchedConfig(url: URL, required: boolean = true, init?: RequestInit, procesFn?: ProcessFetchResponse): IBuilder;

        /**
         * Adds a fetch operation to the collection of data sources that will be used to build the configuration 
         * object.
         * @param request Request object to use when fetching.  Refer to the fetch() documentation for information.
         * @param required Optional Boolean value indicating if the fetch must produce an object.
         * @param init Optional fetch init data.  Refer to the fecth() documentation for information.
         * @param procesFn Optional processing function that must return the configuration data as an object.
         */
        addFetchedConfig(request: RequestInfo, required: boolean = true, init?: RequestInit, procesFn?: ProcessFetchResponse): IBuilder;

        /**
         * Adds the specified JSON string to the collection of data sources that will be used to build the 
         * configuration object.
         * @param json The JSON string to parse into a JavaScript object.
         * @param jsonParser Optional JSON parser.  If not specified, the built-in JSON object will be used.
         * @param reviver Optional reviver function.  For more information see the JSON.parse() documentation.
         */
        addJson(json: string, jsonParser?: JSON, reviver?: (this: any, key: string, value: any) => any): IBuilder;

        /**
         * Adds a single value to the collection of data sources that will be used to build the configuration object.
         * @param path Key comprised of names that determine the hierarchy of the value.
         * @param value Value of the property.
         * @param hierarchySeparator Optional hierarchy separator.  If not specified, colon (:) is assumed.
         */
        addSingleValue(path: string, value: ConfigurationValue, hierarchySeparator: string = ':'): IBuilder;

        /**
         * Sets the data source name of the last data source added to the builder.
         * @param name Name for the data source.
         */
        name(name: string): IBuilder;

        /**
        * Adds the provided environment object as a property of the final configuration object.
        * @param env Previously created environment object.
        * @param propertyName Optional property name for the environment object.
        */
        includeEnvironment(env: IEnvironment, propertyName?: string): IBuilder;

        /**
         * Adds an environment object created with the provided value and names as a property of the final configuration 
         * object.
         * @param value Current environment name.
         * @param envNames List of possible environment names.
         * @param propertyName Optional property name for the environment object.
         */
        includeEnvironment(value: string, envNames?: string[], propertyName?: string): IBuilder;

        /**
         * Creates URL functions in the final configuration object for URL's defined according to the wj-config standard.
         * @param wsPropertyNames Optional list of property names whose values are expected to be objects that contain 
         * host, port, scheme or root path data at some point in their child hierarchy.  If not provided, then the default 
         * list will be used.
         * @param routeValueRegExp Optional regular expression used to identify replaceable route values.  If this is not 
         * provided, then the default regular expression will match route values of the form {<route value name>}, such as 
         * {code} or {id}.
         */
        createUrlFunctions(wsPropertyNames?: string[], routeValueRegExp?: RegExp): IBuilder;

        /**
         * Asynchronously builds the final configuration object.
         */
        build(traceValueSources: boolean = false): Promise<IConfig>;
    }

    export type EnvironmentTest = () => boolean;

    /**
     * Defines the capabilities required from environment objects.
     */
    export interface IEnvironment {
        /**
         * The current environment name.
         */
        readonly value: string;

        /**
         * The list of known environment names.
         */
        readonly names: string[];
        [x: string | 'value' | 'names']: EnvironmentTest | string | string[]
    }

    /**
     * Environment interface that describes the environment object created with default environment names.
     */
    export interface IDefaultEnvironment extends IEnvironment {
        /**
         * Tests if the current environment is the Development environment.
         */
        isDevelopment: EnvironmentTest;

        /**
         * Tests if the current environment is the PreProduction environment.
         */
        isPreProduction: EnvironmentTest;

        /**
         * Tests if the current environment is the Production environment.
         */
        isProduction: EnvironmentTest
    }

    export type RouteValuesFunction = (name: string) => string
    export type RouteValues = RouteValuesFunction | { [x: string]: string }
    export type QueryString = (() => string | ICoreConfig) | string | ICoreConfig

    /**
     * Defines the capabilities exposed by non-leaf nodes in a webservices hierarchy.
     */
    export interface IWsPath extends ICoreConfig {
        rootPath?: string;
        _rootPath: () => string;
        buildUrl: (url: string, replaceValues?: RouteValues, queryString?: QueryString) => string;
    }

    /**
     * Defines the capabilities exposed by non-leaf nodes in a webservices hierarchy that are the parent (or root) of all 
     * other webservice nodes in the hierarchy.
     */
    export interface IWsParent extends IWsPath {
        host?: string;
        port?: number;
        scheme?: string;
    }

    export class Environment {
        readonly value: string;
        readonly names: string[];
        [x: string]: (() => boolean) | string | string[];
        constructor(value: string, names?: string[]);
    }
}
