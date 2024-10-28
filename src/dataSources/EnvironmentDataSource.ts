import type { Dictionary } from "../wj-config.js";
import { DictionaryDataSource } from "./DictionaryDataSource.js";

export class EnvironmentDataSource<T extends Record<string, any>> extends DictionaryDataSource<T> {
    constructor(env: Dictionary | (() => Promise<Dictionary>), prefix?: string) {
        super(env, '__', prefix);
        if (!prefix) {
            throw new Error('The prefix is mandatory to avoid accidental imports of sensitive data from environment variable values.');
        }
        this.name = 'Environment';
    }
}
