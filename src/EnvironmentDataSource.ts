import type { ICoreConfig } from "wj-config";
import DictionaryDataSource from "./DictionaryDataSource.js";

export default class EnvironmentDataSource extends DictionaryDataSource {
    constructor(env: ICoreConfig, prefix?: string) {
        super(env, '__', prefix);
        if (!prefix) {
            throw new Error('The prefix is mandatory to avoid accidental imports of sensitive data from environment variable values.');
        }
        this.name = 'Environment';
    }
}
