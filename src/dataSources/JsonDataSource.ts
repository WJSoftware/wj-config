import { DataSource } from "./DataSource.js";

export class JsonDataSource<T extends Record<string, any>> extends DataSource {
    private _json: string | (() => Promise<string>);
    private _jsonParser: JSON;
    private _reviver?: (this: any, key: string, value: any) => any;
    constructor(json: string | (() => Promise<string>), jsonParser?: JSON, reviver?: (this: any, key: string, value: any) => any) {
        super('JSON Data');
        this._json = json;
        this._jsonParser = jsonParser ?? JSON;
        this._reviver = reviver;
    }

    async getObject() {
        let json = this._json;
        if (typeof json === 'function') {
            json = await json();
        }
        return this._jsonParser.parse(json, this._reviver) as T;
    }
}
