declare module 'wj-config' {
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
    type IConfig = ICoreConfig | IEnvConfig | IDefaultEnvConfig;

    /**
     * Defines the core and most basic capabilities found in configuration objects.
     */
    interface ICoreConfig {
        [x: string | symbol]: ConfigurationValue;
    }

    /**
     * Defines the capabilities of a configurtion object that contains an environment object in the environment property.
     */
    interface IEnvConfig extends ICoreConfig {
        environment: IEnvironment;
    }

    /**
     * Defines the capabilities of a configurtion object that contains an environment object in the environment property 
     * created using the default list of environment names.
     */
    interface IDefaultEnvConfig extends ICoreConfig {
        environment: IDefaultEnvironment
    }

    /**
     * Defines the capabilities required from data source information objects used in value tracing.
     */
    export interface IDataSourceInfo {
        /**
         * Provides a name of the data source instance that can be used in messages and logs.
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
        add(dataSource: IDataSource): IBuilderWithDataSource;
        /**
         * Adds the specified object to the collection of data sources that will be used to build the configuration object.
         * @param obj Data object to include as part of the final configuration data.
         */
        addObject(obj: IConfig): IBuilderWithDataSource;

        /**
         * Adds the specified dictionary to the collection of data sources that will be used to build the configuration 
         * object.
         * @param dictionary Dictionary object to include (after processing) as part of the final configuration data.
         * @param hierarchySeparator Optional hierarchy separator.  If none is specified, a colon (:) is assumed.
         * @param prefix Optional prefix.  Only properties that start with the specified prefix are included, and the 
         * prefix is always removed after the dictionary is processed.  If no prefix is provided, then all dictionary 
         * entries will contribute to the configuration data.
         */
        addDictionary(dictionary: IConfig, hierarchySeparator?: string, prefix?: string): IBuilderWithDataSource;

        /**
         * 
         * @param dictionary Dictionary object to include (after processing) as part of the final configuration data.
         * @param hierarchySeparator Optional hierarchy separator.  If none is specified, a colon (:) is assumed.
         * @param predicate Optional predicate function that is called for every property in the dictionary.  Only when 
         * the return value of the predicate is true the property is included in configuration.
         */
        addDictionary(dictionary: IConfig, hierarchySeparator?: string, predicate?: Predicate<string>): IBuilderWithDataSource;

        /**
         * Adds the qualifying environment variables to the collection of data sources that will be used to build the 
         * configuration object.
         * @param env Environment object containing the environment variables to include in the configuration.
         * @param prefix Optional prefix.  Only properties that start with the specified prefix are included, and the 
         * prefix is always removed after processing.  To avoid exposing non-application data as configuration, a prefix 
         * is always used.  If none is specified, the default prefix is OPT_.
         */
        addEnvironment(env: IConfig, prefix?: string): IBuilderWithDataSource;

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

        includeValueTrace()

        /**
         * Asynchronously builds the final configuration object.
         */
        build(): Promise<IConfig>;
    }

    type EnvironmentTest = () => boolean;

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
    interface IDefaultEnvironment extends IEnvironment {
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
     * Defines the capabilities exposed by non-leaf nodes in a webservices hierarchy.
     */
    interface IWsPath extends ICoreConfig {
        rootPath?: string;
        _rootPath: () => string;
        buildUrl: (url: string, replaceValues: RouteValues) => string;
    }

    /**
     * Defines the capabilities exposed by non-leaf nodes in a webservices hierarchy that are the parent (or root) of all 
     * other webservice nodes in the hierarchy.
     */
    interface IWsParent extends IWsPath {
        host?: string;
        port?: number;
        scheme?: string;
    }

    export declare class Environment {
        readonly value: string;
        readonly names: string[];
        [x: string]: (() => boolean) | string | string[];
        constructor(value: string, names?: string[]);
    }
}
