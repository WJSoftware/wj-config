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

export default class DictionaryDataSource extends DataSource implements IDataSource {
    private _dictionary: ICoreConfig | (() => ICoreConfig);
    private _hierarchySeparator: string;
    private _prefixOrPredicate?: string | Predicate<string>;

    #buildPredicate(): [Predicate<string>, string] {
        let predicateFn: Predicate<string> = name => true;
        let prefix: string = '';
        if (this._prefixOrPredicate) {
            if (typeof this._prefixOrPredicate === "string") {
                prefix = this._prefixOrPredicate;
                predicateFn = name => name.startsWith(prefix);
            }
            else {
                predicateFn = this._prefixOrPredicate;
            }
        }
        return [predicateFn, prefix];
    }

    #validateDictionary(dic: ICoreConfig) {
        if (!isConfig(dic)) {
            throw new Error('The provided dictionary must be a flat object.');
        }
        const [predicateFn, prefix] = this.#buildPredicate();
        forEachProperty(dic, (k, v) => {
            if (!predicateFn(k)) {
                // This property does not qualify, so skip its validation.
                return false;
            }
            if (isConfig(v)) {
                throw new Error(`The provided dictionary must be a flat object:  Property ${k} has a non-scalar value.`);
            }
        });
    }

    #inflateDictionary(dic: ICoreConfig) {
        const result: ICoreConfig = {};
        if (!dic || !isConfig(dic)) {
            return result;
        }
        const [predicateFn, prefix] = this.#buildPredicate();
        forEachProperty(dic, (key, value) => {
            if (predicateFn(key)) {
                // Object values are disallowed because a dictionary's source is assumed to be flat.
                if (isConfig(value)) {
                    throw new Error(`Dictionary data sources cannot hold object values.  Key: ${key}`);
                }
                const keyParts = processKey(key, this._hierarchySeparator, prefix);
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
    }

    constructor(dictionary: ICoreConfig | (() => ICoreConfig), hierarchySeparator: string, prefixOrPredicate?: string | Predicate<string>) {
        super('Dictionary');
        if (!hierarchySeparator) {
            throw new Error('Dictionaries must specify a hierarchy separator.');
        }
        if (typeof hierarchySeparator !== 'string') {
            throw new Error('The hierarchy separator must be a string.');
        }
        this._hierarchySeparator = hierarchySeparator;
        if (typeof prefixOrPredicate === 'string' && prefixOrPredicate.length === 0) {
            throw new Error('The provided prefix value cannot be an empty string.');
        }
        this._prefixOrPredicate = prefixOrPredicate;
        if (dictionary && typeof dictionary !== 'function') {
            this.#validateDictionary(dictionary);
        }
        this._dictionary = dictionary;
    }

    getObject(): Promise<ICoreConfig> {
        let dic = this._dictionary;
        if (dic && typeof dic === 'function') {
            dic = dic();
        }
        const inflatedObject = this.#inflateDictionary(dic);
        return Promise.resolve(inflatedObject);
    }
}
