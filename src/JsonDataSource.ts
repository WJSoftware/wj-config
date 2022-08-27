import { DataSource } from "./DataSource.js";

export default class JsonDataSource extends DataSource {
    private _json: string;
    private _jsonParser: JSON;
    private _reviver?: (this: any, key: string, value: any) => any;
    constructor(json: string, jsonParser?: JSON, reviver?: (this: any, key: string, value: any) => any) {
        super('JSON Data');
        this._json = json;
        this._jsonParser = jsonParser ?? JSON;
        this._reviver = reviver;
    }

    getObject() {
        return this._jsonParser.parse(this._json, this._reviver);
    }
}
