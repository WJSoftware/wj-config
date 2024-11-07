import type { IDataSourceInfo } from "../wj-config.js";

export class DataSource {
    name: string;
    index?: number;
    private _traceObject?: IDataSourceInfo;

    constructor(name: string) {
        this.name = name;
    }

    trace() {
        return this._traceObject = this._traceObject ?? {
            name: this.name,
            index: this.index
        };
    }
}