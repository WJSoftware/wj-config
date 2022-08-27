import type { ICoreConfig, ProcessFetchResponse } from "wj-config";
import { DataSource } from "./DataSource.js";

export default class FetchedConfigDataSource extends DataSource {
    private _input: URL | RequestInfo;
    private _required: boolean;
    private _init?: RequestInit;
    private _processFn: ProcessFetchResponse;
    constructor(input: URL | RequestInfo, required: boolean = true, init?: RequestInit, processFn?: ProcessFetchResponse) {
        super(typeof input === 'string' ? `Fetch ${input}` : 'Fetched Configuration');
        this._input = input;
        this._required = required;
        this._init = init;
        this._processFn = processFn ?? ((response) => response.json());
    }

    async getObject(): Promise<ICoreConfig> {
        let response: Response;
        response = await fetch(this._input, this._init);
        let data: ICoreConfig = {};
        if ((response.status === 204 || !response.ok || !(data = await this._processFn(response))) && this._required) {
            throw new Error(`${this.name}: Configuration data from this source is required but the fetch operation yielded no data.`);
        }
        return data;
    }
}
