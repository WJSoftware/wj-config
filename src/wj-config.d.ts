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
    export type ConfigurationValue = string | number | Date | boolean | IEnvironment | IDefaultEnvironment | undefined | null | Function | ICoreConfig | IDataSourceInfo | IDataSourceInfo[];

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
         * Adds the provided data source to the collection of data sources that will be used to build the 
         * configuration object.
         * @param dataSource The data source to include.
         */
        add(dataSource: IDataSource): IBuilder;
        /**
         * Adds the specified object to the collection of data sources that will be used to build the configuration 
         * object.
         * @param obj Data object to include as part of the final configuration data, or a function that returns said 
         * object.
         */
        addObject(obj: ICoreConfig | (() => ICoreConfig)): IBuilder;

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
        addDictionary(dictionary: ICoreConfig | (() => ICoreConfig), hierarchySeparator?: string, prefix?: string): IBuilder;

        /**
         * 
         * @param dictionary Dictionary object to include (after processing) as part of the final configuration data, 
         * or a function that returns said object.
         * @param hierarchySeparator Optional hierarchy separator.  If none is specified, a colon (:) is assumed.
         * @param predicate Optional predicate function that is called for every property in the dictionary.  Only when 
         * the return value of the predicate is true the property is included in configuration.
         */
        addDictionary(dictionary: IConfig, hierarchySeparator?: string, predicate?: Predicate<string>): IBuilder;

        /**
         * Adds the qualifying environment variables to the collection of data sources that will be used to build the 
         * configuration object.
         * @param env Environment object containing the environment variables to include in the configuration, or a 
         * function that returns said object.
         * @param prefix Optional prefix.  Only properties that start with the specified prefix are included, and the 
         * prefix is always removed after processing.  To avoid exposing non-application data as configuration, a prefix 
         * is always used.  If none is specified, the default prefix is OPT_.
         */
        addEnvironment(env: IConfig | (() => ICoreConfig), prefix?: string): IBuilder;

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
         * @param json The JSON string to parse into a JavaScript object, or a function that returns said string.
         * @param jsonParser Optional JSON parser.  If not specified, the built-in JSON object will be used.
         * @param reviver Optional reviver function.  For more information see the JSON.parse() documentation.
         */
        addJson(json: string | (() => string), jsonParser?: JSON, reviver?: (this: any, key: string, value: any) => any): IBuilder;

        /**
         * Adds a single value to the collection of data sources that will be used to build the configuration object.
         * @param path Key comprised of names that determine the hierarchy of the value, or a function that returns 
         * the [key, value] tuple that needs to be added.  If using the second one, the "value" argument is ignored.
         * @param value Value of the property; ignored if "path" is a tuple-returning function.
         * @param hierarchySeparator Optional hierarchy separator.  If not specified, colon (:) is assumed.
         */
        addSingleValue(path: string | (() => [string, ConfigurationValue]), value?: ConfigurationValue, hierarchySeparator: string = ':'): IBuilder;

        /**
         * Special function that allows the developer the opportunity to add one data source per defined environment.
         * 
         * The function iterates through all possible environments and calls the addDs function for each one.  It is 
         * assumed that the addDs function will add zero or one data source.  To signal no data source was added, 
         * addDs must return the boolean value "false".
         * @param addDs Function that is meant to add a single data source of any type that is associated to the 
         * provided environment name.
         */
        addPerEnvironment(addDs: (builder: IBuilder, envName: string) => boolean | string): IBuilder;

        /**
         * Sets the data source name of the last data source added to the builder.
         * @param name Name for the data source.
         */
        name(name: string): IBuilder;

        /**
         * Makes the last-added data source conditionally inclusive.
         * @param predicate Predicate function that is run whenever the build function runs.  If the predicate returns 
         * true, then the data source will be included; if it returns false, then the data source is skipped.
         * @param dataSourceName Optional data source name.  Provided to simplify the build chain and is merely a 
         * shortcut to include a call to the name() function.  Equivalent to when().name().
         */
        when(predicate: Predicate<IEnvironment | undefined>, dataSourceName?: string): IBuilder;

        /**
         * Makes the last-added data source conditionally included only if the current environment possesses all of 
         * the listed traits.
         * @param traits The traits the current environment must have for the data source to be added.
         * @param dataSourceName Optional data source name.  Provided to simplify the build chain and is merely a 
         * shortcut to include a call to the name() function.  Equivalent to whenAllTraits().name().
         */
        whenAllTraits(traits: Traits, dataSourceName?: string): IBuilder;

        /**
         * Makes the last-added data source conditionally included if the current environment possesses any of the 
         * listed traits.  Only one coincidence is necessary.
         * @param traits The list of possible traits the current environment may have in order for the data source to 
         * be included.
         * @param dataSourceName Optional data source name.  Provided to simplify the build chain and is merely a 
         * shortcut to include a call to the name() function.  Equivalent to whenAnyTrait().name().
         */
        whenAnyTrait(traits: Traits, dataSourceName?: string): IBuilder;

        /**
         * Makes the last-added data source conditionally included if the current environment's name is equal to the 
         * provided environment name.
         * @param envName The environment name to use to conditionally include the last-added data source.
         * @param dataSourceName Optional data source name.  Provided to simplify the build chain and is 
         * merely a shortcut to include a call to the name() function.
         */
        forEnvironment(envName: string, dataSourceName?: string): IBuilder;

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
         * list will be used.  It can also be a single string, which is the same as a 1-element array.
         * @param routeValueRegExp Optional regular expression used to identify replaceable route values.  If this is not 
         * provided, then the default regular expression will match route values of the form {<route value name>}, such as 
         * {code} or {id}.
         */
        createUrlFunctions(wsPropertyNames?: string | string[], routeValueRegExp?: RegExp): IBuilder;

        /**
         * Asynchronously builds the final configuration object.
         */
        build(traceValueSources: boolean = false): Promise<IConfig>;
    }

    /**
     * Function type that allows environment objects to declare testing functions, such as isProduction().
     */
    export type EnvironmentTest = () => boolean;

    /**
     * Defines the capabilities required from environment objects.
     */
    export interface IEnvironment {
        /**
         * The current environment (represented by an environment definition).
         */
        readonly current: IEnvironmentDefinition;

        /**
         * The list of known environments (represented by a list of environment definitions).
         */
        readonly all: string[];

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
        [x: string | 'current' | 'all' | 'hasTraits' | 'hasAnyTrait']: EnvironmentTest | IEnvironmentDefinition | string[] | ((traits: Traits) => boolean)
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

    /**
     * Type of function used as route values when calling a URL-building function.
     */
    export type RouteValuesFunction = (name: string) => string

    /**
     * Type that describes the possible ways of passing route values when calling a URL-building function.
     */
    export type RouteValues = RouteValuesFunction | { [x: string]: string }

    /**
     * Type that describes the possible ways of specifing a query string when calling a URL-building function.
     */
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

    /**
     * Environment class used to provide environment information through the configuration object.
     */
    export class Environment {
        /**
         * Current environment.
         */
        readonly current: IEnvironmentDefinition;

        /**
         * List of all defined environments.
         */
        readonly all: string[];
        [x: string]: (() => boolean) | string | string[];

        /**
         * Initializes a new instance of this class.
         * @param currentEnvironment The current environment name or the current environment as an 
         * IEnvironmentDefinition object.
         * @param possibleEnvironments The list of all possible environment names.  It is used to create the 
         * environment test functions and to validate that the current environment is part of this list, minimizing 
         * the possibility of a mispelled name.
         */
        constructor(currentEnvironment: string | IEnvironmentDefinition, possibleEnvironments?: string[]);
    }

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
    export interface IEnvironmentDefinition {
        /**
         * Gets the environment's name.
         */
        readonly name: string,

        /**
         * Gets the environment's traits.
         */
        readonly traits: Traits
    }
}
