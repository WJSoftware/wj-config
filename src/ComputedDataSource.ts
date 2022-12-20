import type { ComputedConfigFunction, ICoreConfig, IDataSource } from "wj-config";
import { DataSource } from "./DataSource.js";
import { isFunction } from "./helpers.js";

/**
 * Configuration data source class that injects a JavaScript object into the configuration build chain by evaluating 
 * the provided function.
 */
export class ComputedDataSource extends DataSource implements IDataSource {
    /**
     * The function to execute in order to obtain the configuration data.
     */
    private _fn: ComputedConfigFunction;

    /**
     * Initializes a new instance of this class.
     * @param fn Function to execute in order to obtain the configuration data.
     */
    constructor(fn: ComputedConfigFunction) {
        super('Computed');
        if (!isFunction(fn)) {
            throw new Error('The provided argument is not function.  Make sure you provide as argument a function that returns the configuration object (or a promise of it).');
        }
        this._fn = fn;
    }

    getObject(): Promise<ICoreConfig> {
        return Promise.resolve(this._fn());
    };
}
