import type { ICoreConfig } from "wj-config";
import DictionaryDataSource from "./DictionaryDataSource.js";

export default class EnvironmentDataSource extends DictionaryDataSource {
    constructor(env: ICoreConfig, prefix?: string) {
        super(env, '__', prefix);
        this.name = 'Environment Data Source';
    }
}
