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
    private _obj: ICoreConfig | (() => Promise<ICoreConfig>);

    #validateObject(obj: ICoreConfig) {
        if (!isConfig(obj)) {
            throw new Error('The provided object is not suitable as configuration data source.');
        }
    }

    /**
     * Initializes a new instance of this class.
     * @param obj Data object to inject into the configuration build chain.
     */
    constructor(obj: ICoreConfig | (() => Promise<ICoreConfig>)) {
        super('Object');
        if (typeof obj !== 'function') {
            this.#validateObject(obj);
        }
        this._obj = obj;
    }

    async getObject(): Promise<ICoreConfig> {
        let obj = this._obj;
        if (typeof obj === 'function') {
            obj = await obj();
        }
        this.#validateObject(obj);
        return Promise.resolve(obj);
    };
}
