import type { ConfigurationValue, ICoreConfig } from "wj-config";
import DictionaryDataSource from "./DictionaryDataSource.js";

const buildDictionary = (key: string | (() => [string, ConfigurationValue]), value?: ConfigurationValue): ICoreConfig | (() => ICoreConfig) => {
    if (!key) {
        throw new Error('No valid path was provided.');
    }
    const dicFn = (k: string, v: ConfigurationValue) => {
        const dic: ICoreConfig = {};
        dic[k] = v;
        return dic;
    };
    if (typeof key === 'function') {
        return () => {
            const [k, v] = (key as (() => [string, ConfigurationValue]))();
            return dicFn(k, v);
        };
    }
    return dicFn(key, value);
}

export default class SingleValueDataSource extends DictionaryDataSource {
    constructor(path: string | (() => [string, ConfigurationValue]), value?: ConfigurationValue, hierarchySeparator: string = ':') {
        super(buildDictionary(path, value), hierarchySeparator);
        if (typeof path === 'string') {
            this.name = `Single Value: ${path}`;
        }
        else {
            this.name = 'Single Value';
        }
    }
}
