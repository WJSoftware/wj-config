import type { ConfigurationValue, ICoreConfig, IDataSource, Predicate } from "wj-config";
import { DataSource } from "./DataSource.js";
import { attemptParse, forEachProperty, isConfig } from "./helpers.js";

const processKey = (key: string, hierarchySeparator: string, prefix?: string) => {
    if (prefix) {
        key = key.substring(prefix.length);
    }
    return key.split(hierarchySeparator);
};

const ensurePropertyValue = (obj: ICoreConfig, name: string) => {
    if (obj[name] === undefined) {
        obj[name] = {};
    }
    return obj[name];
}

const inflateDictionary = (dic: ICoreConfig, hierarchySeparator: string, prefixOrPredicate?: string | Predicate<string>) => {
    const result: ICoreConfig = {};
    if (!dic || !isConfig(dic)) {
        return result;
    }
    let predicateFn: Predicate<string> = name => true;
    let prefix: string;
    if (prefixOrPredicate) {
        if (typeof prefixOrPredicate === "string") {
            if (prefixOrPredicate.length === 0) {
                throw new Error('The provided prefix value cannot be an empty string.');
            }
            prefix = prefixOrPredicate;
            predicateFn = name => name.startsWith(prefixOrPredicate);
        }
        else {
            predicateFn = prefixOrPredicate;
        }
    }
    forEachProperty(dic, (key, value) => {
        if (predicateFn(key)) {
            // Object values are disallowed because a dictionary's source is assumed to be flat.
            if (isConfig(value)) {
                throw new Error(`Dictionary data sources cannot hold object values.  Key: ${key}`);
            }
            const keyParts = processKey(key, hierarchySeparator, prefix);
            let obj: ConfigurationValue = result;
            for (let i = 0; i < keyParts.length - 1; ++i) {
                obj = ensurePropertyValue(obj as ICoreConfig, keyParts[i]);
                if (!isConfig(obj)) {
                    throw new Error(`Cannot set the value of variable "${key}" because "${keyParts[i]}" has already been created as a leaf value.`);
                }
            }
            // Ensure there is no value override.
            if ((obj as ICoreConfig)[keyParts[keyParts.length - 1]]) {
                throw new Error(`Cannot set the value of variable "${key}" because "${keyParts[keyParts.length - 1]}" has already been created as an object to hold other values.`);
            }
            // If the value is a string, attempt parsing.  This is to support data sources that can only hold strings
            // as values, such as enumerating actual system environment variables.
            if (typeof value === 'string') {
                value = attemptParse(value);
            }
            (obj as ICoreConfig)[keyParts[keyParts.length - 1]] = value;
        }
    });
    return result;
};

export default class DictionaryDataSource extends DataSource implements IDataSource {
    private _dictionary: ICoreConfig;
    private _hierarchySeparator?: string;
    private _prefixOrPredicate?: string | Predicate<string>;

    constructor(dictionary: ICoreConfig, hierarchySeparator?: string, prefixOrPredicate?: string | Predicate<string>) {
        super('Dictionary');
        this._dictionary = dictionary;
        this._hierarchySeparator = hierarchySeparator;
        this._prefixOrPredicate = prefixOrPredicate;
    }

    getObject(): Promise<ICoreConfig> {
        const inflatedObject = inflateDictionary(this._dictionary, this._hierarchySeparator ?? '__', this._prefixOrPredicate);
        return Promise.resolve(inflatedObject);
    }
}
