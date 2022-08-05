import type { ConfigurationValue, ICoreConfig } from "wj-config";
import DictionaryDataSource from "./DictionaryDataSource.js";

const buildDictionary = (key: string, value: ConfigurationValue): ICoreConfig => {
    if (!key) {
        throw new Error('No valid path was provided.');
    }
    const dic: ICoreConfig = {};
    dic[key] = value;
    return dic;
}

export default class SingleValueDataSource extends DictionaryDataSource {
    constructor(path: string, value: ConfigurationValue, hierarchySeparator: string = ':') {
        super(buildDictionary(path, value), hierarchySeparator);
        this.name = `Single Value Data Source: ${path}`;
    }
}
