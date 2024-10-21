import type { IDataSource } from "wj-config";
import { DataSource } from "./DataSource.js";
import { isConfigNode } from "./helpers.js";

/**
 * Configuration data source class that injects a pre-build JavaScript object into the configuration build chain.
 */
export class ObjectDataSource<T extends Record<string, any>> extends DataSource implements IDataSource<T> {
    /**
     * The object to inject.
     */
    private _obj: T | (() => Promise<T>);

    #validateObject(obj: T) {
        if (!isConfigNode(obj)) {
            throw new Error('The provided object is not suitable as configuration data source.');
        }
    }

    /**
     * Initializes a new instance of this class.
     * @param obj Data object to inject into the configuration build chain.
     */
    constructor(obj: T | (() => Promise<T>)) {
        super('Object');
        if (typeof obj !== 'function') {
            this.#validateObject(obj);
        }
        this._obj = obj;
    }

    async getObject(): Promise<T> {
        let obj = this._obj;
        if (typeof obj === 'function') {
            obj = await obj();
        }
        this.#validateObject(obj);
        return Promise.resolve(obj);
    };
}
