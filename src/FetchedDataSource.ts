import type { ICoreConfig, ProcessFetchResponse } from "wj-config";
import { DataSource } from "./DataSource.js";

export default class FetchedDataSource extends DataSource {
    private _input: URL | RequestInfo | (() => Promise<URL | RequestInfo>);
    private _required: boolean;
    private _init?: RequestInit;
    private _processFn: ProcessFetchResponse;
    constructor(input: URL | RequestInfo | (() => Promise<URL | RequestInfo>), required: boolean = true, init?: RequestInit, processFn?: ProcessFetchResponse) {
        super(typeof input === 'string' ? `Fetch ${input}` : 'Fetched Configuration');
        this._input = input;
        this._required = required;
        this._init = init;
        this._processFn = processFn ?? (async (response) => {
            if (this._required && response.status === 204) {
                throw new Error(`${this.name}: Configuration data from this source is required but the fetch operation yielded no data.`);
            }
            else if (this._required && response.status === 404) {
                throw new Error(`${this.name}: Configuration data from this source is required but the fetch operation could not find the resource.`);
            }
            else if (this._required && !response.ok) {
                throw new Error(`${this.name}: Configuration data from this source is required but the fetch operation yielded a non-OK response: ${response.status} (${response.statusText}).`);
            }
            else if (response.ok && response.status !== 204) {
                return await response.json();
            }
            return null;
        });
    }

    async getObject(): Promise<ICoreConfig> {
        let input = this._input;
        if (typeof input === 'function') {
            input = await input();
        }
        let data: ICoreConfig = {};
        try {
            const response = await fetch(input, this._init);
            try {
                data = await this._processFn(response);
            }
            catch (err) {
                console.debug('Error processing fetched response: %o', err);
                if (this._required) {
                    // Strange.  While navigating to the TS definition I clearly see that the cause property is of type unknown,
                    // but tsc actually throws an error saying it is of type Error | undefined, so casting as Error.
                    throw new Error(`${this.name}: An error occurred while processing the fetched response.`, { cause: err as Error });
                }
            }
        }
        catch (err) {
            if (this._required) {
                throw err;
            }
        }
        return data;
    }
}
