import type { ConfigurationValue, Dictionary } from "../wj-config.js";
import { DictionaryDataSource } from "./DictionaryDataSource.js";

function buildDictionary(key: string | (() => Promise<[string, ConfigurationValue]>), value?: ConfigurationValue) {
    if (!key) {
        throw new Error('No valid path was provided.');
    }
    const dicFn = (k: string, v: ConfigurationValue) => {
        const dic: Dictionary = {};
        dic[k] = v;
        return dic;
    };
    if (typeof key === 'function') {
        return async () => {
            const [k, v] = await (key as (() => Promise<[string, ConfigurationValue]>))();
            return dicFn(k, v);
        };
    }
    return dicFn(key, value);
}

export class SingleValueDataSource<T extends Record<string, any>> extends DictionaryDataSource<T> {
    constructor(
        path: string | (() => Promise<[string, ConfigurationValue]>),
        value?: ConfigurationValue,
        hierarchySeparator: string = ':'
    ) {
        super(buildDictionary(path, value), hierarchySeparator);
        if (typeof path === 'string') {
            this.name = `Single Value: ${path}`;
        }
        else {
            this.name = 'Single Value';
        }
    }
}
