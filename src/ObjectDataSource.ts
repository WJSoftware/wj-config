import type { ICoreConfig, IDataSource } from "wj-config";
import { DataSource } from "./DataSource.js";
import { isConfig } from "./helpers.js";

/**
 * Configuration data source class that injects a pre-build JavaScript object into the configuration build chain.
 */
export class ObjectDataSource extends DataSource implements IDataSource {
    /**
     * The object to inject.
     */
    private _obj: ICoreConfig | (() => ICoreConfig);

    /**
     * Initializes a new instance of this class.
     * @param obj Data object to inject into the configuration build chain.
     */
    constructor(obj: ICoreConfig | (() => ICoreConfig)) {
        super('Object');
        if (!isConfig(obj)) {
            throw new Error('The provided object is not suitable as configuration data source.');
        }
        this._obj = obj;
    }

    getObject(): Promise<ICoreConfig> {
        let obj = this._obj;
        if (typeof obj === 'function') {
            obj = obj();
        }
        return Promise.resolve(obj);
    };
}
