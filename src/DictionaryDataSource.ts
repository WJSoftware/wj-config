import type { ConfigurationNode, ConfigurationValue, Dictionary, IDataSource, Predicate } from "wj-config";
import { DataSource } from "./DataSource.js";
import { attemptParse, forEachProperty, isConfigNode } from "./helpers.js";

const processKey = (key: string, hierarchySeparator: string, prefix?: string) => {
    if (prefix) {
        key = key.substring(prefix.length);
    }
    return key.split(hierarchySeparator);
};

const ensurePropertyValue = (obj: ConfigurationNode, name: string) => {
    if (obj[name] === undefined) {
        obj[name] = {};
    }
    return obj[name];
}

export default class DictionaryDataSource<T extends Record<string, any>> extends DataSource implements IDataSource<T> {
    #dictionary: Record<string, ConfigurationValue> | (() => Promise<Record<string, ConfigurationValue>>);
    #hierarchySeparator: string;
    #prefixOrPredicate?: string | Predicate<string>;

    #buildPredicate(): [Predicate<string>, string] {
        let predicateFn: Predicate<string> = _ => true;
        let prefix: string = '';
        if (this.#prefixOrPredicate) {
            if (typeof this.#prefixOrPredicate === "string") {
                prefix = this.#prefixOrPredicate;
                predicateFn = name => name.startsWith(prefix);
            }
            else {
                predicateFn = this.#prefixOrPredicate;
            }
        }
        return [predicateFn, prefix];
    }

    #validateDictionary(dic: unknown) {
        if (!isConfigNode(dic)) {
            throw new Error('The provided dictionary must be a flat object.');
        }
        const [predicateFn, prefix] = this.#buildPredicate();
        forEachProperty(dic, (k, v) => {
            if (!predicateFn(k)) {
                // This property does not qualify, so skip its validation.
                return false;
            }
            if (isConfigNode(v)) {
                throw new Error(`The provided dictionary must be a flat object:  Property ${k} has a non-scalar value.`);
            }
        });
    }

    #inflateDictionary(dic: Dictionary) {
        const result = {} as T;
        if (!dic) {
            return result;
        }
        const [predicateFn, prefix] = this.#buildPredicate();
        forEachProperty(dic, (key, value) => {
            if (predicateFn(key)) {
                // Object values are disallowed because a dictionary's source is assumed to be flat.
                // if (isConfigNode(value)) {
                //     throw new Error(`Dictionary data sources cannot hold object values.  Key: ${key}`);
                // }
                const keyParts = processKey(key, this.#hierarchySeparator, prefix);
                let obj: ConfigurationValue | ConfigurationNode = result;
                let keyPath = '';
                for (let i = 0; i < keyParts.length - 1; ++i) {
                    keyPath += (keyPath.length ? '.' : '') + keyParts[i];
                    obj = ensurePropertyValue(obj, keyParts[i]);
                    if (!isConfigNode(obj)) {
                        throw new Error(`Cannot set the value of property "${key}" because "${keyPath}" has already been created as a leaf value.`);
                    }
                }
                // Ensure there is no value override.
                if (obj[keyParts[keyParts.length - 1]]) {
                    throw new Error(`Cannot set the value of variable "${key}" because "${keyParts[keyParts.length - 1]}" has already been created as an object to hold other values.`);
                }
                // If the value is a string, attempt parsing.  This is to support data sources that can only hold strings
                // as values, such as enumerating actual system environment variables.
                if (typeof value === 'string') {
                    value = attemptParse(value);
                }
                obj[keyParts[keyParts.length - 1]] = value;
            }
        });
        return result;
    }

    constructor(dictionary: Dictionary | (() => Promise<Dictionary>), hierarchySeparator: string, prefixOrPredicate?: string | Predicate<string>) {
        super('Dictionary');
        if (!hierarchySeparator) {
            throw new Error('Dictionaries must specify a hierarchy separator.');
        }
        if (typeof hierarchySeparator !== 'string') {
            throw new Error('The hierarchy separator must be a string.');
        }
        this.#hierarchySeparator = hierarchySeparator;
        if (prefixOrPredicate !== undefined) {
            if (typeof prefixOrPredicate === 'string' && prefixOrPredicate.length === 0) {
                throw new Error('The provided prefix value cannot be an empty string.');
            }
            if (typeof prefixOrPredicate !== 'string' && typeof prefixOrPredicate !== 'function') {
                throw new Error('The prefix argument can only be a string or a function.');
            }
            if (typeof prefixOrPredicate === 'string' && prefixOrPredicate.length === 0) {
                throw new Error('An empty string cannot be used as prefix.');
            }
        }
        this.#prefixOrPredicate = prefixOrPredicate;
        if (typeof dictionary !== 'function') {
            this.#validateDictionary(dictionary);
        }
        this.#dictionary = dictionary;
    }

    async getObject(): Promise<T> {
        let dic = this.#dictionary;
        if (dic && typeof dic === 'function') {
            dic = await dic();
            this.#validateDictionary(dic);
        }
        const inflatedObject = this.#inflateDictionary(dic);
        return Promise.resolve(inflatedObject);
    }
}
