'use strict';

import { ConfigurationNode, Dictionary } from "wj-config";

/**
 * Tests the provided object to determine if it is an array.
 * @param obj Object to test.
 * @returns True if the object is an array; false otherwise.
 */
export function isArray(obj: unknown): obj is any[] { return Array.isArray(obj); }

/**
 * Tests the provided object to determine if it is an object that can be considered a non-leaf property in a 
 * configuration object.
 * @param obj Object to test.
 * @returns True if the object is a non-leaf object; false otherwise.
 */
export function isConfigNode(obj: unknown): obj is ConfigurationNode {
    return typeof obj === 'object'
        && !isArray(obj)
        && !(obj instanceof Date)
        && !(obj instanceof Set)
        && !(obj instanceof Map)
        && !(obj instanceof WeakMap)
        && !(obj instanceof WeakRef)
        && !(obj instanceof WeakSet)
        ;
}

/**
 * Tests a particular object to determine if it is a dictionary.
 * @param obj Object to test.
 * @returns `true` if the object is a dictionary, or `false` otherwise.
 */
export function isDictionary(obj: unknown): obj is Dictionary {
    if (typeof obj === 'object' && obj !== null && !isArray(obj) && !(obj instanceof Date)) {
        for (let key in obj) {
            if (isConfigNode((obj as Record<string, any>)[key])) {
                return false;
            }
        }
        return true;
    }
    return false;
}

/**
 * Tests the provided object to determine if it is a function.
 * @param obj Object to test.
 * @returns True if the object is a function; false otherwise.
 */
export function isFunction(obj: unknown): obj is Function { return typeof obj === 'function'; }

/**
 * Enumerates all the properties of the specified object that are owned by the object, therefore excluding the ones 
 * inherited from the prototype.
 * @param obj Object whose properties will be enumerated.
 * @param loopBody Callback function that receives the property name (key), value and index.  If the callback returns 
 * truthy then the enumeration stops.
 */
export const forEachProperty = (obj: any, loopBody: (key: string, value: any, index?: number) => boolean | void) => {
    if (!isFunction(loopBody)) {
        throw new Error('The provided loop body is not a function.');
    }
    for (const [key, value] of Object.entries(obj)) {
        let index = 0;
        if (loopBody(key, value, index++)) {
            break;
        }
    }
};

/**
 * Attempts to parse the provided value in order to convert it to a more specialized primitive type.
 * 
 * Specifically it will attempt to obtain a Boolean, integer or floating point value.  If all fails, then the value 
 * is kept as a string.
 * @param value Value to parse.
 * @returns The converted value, or the value's string representation if no conversion was possible.
 */
export const attemptParse = (value: (string | undefined | null)) => {
    const isInteger = /^-?\d+$/;
    const isHex = /^0x[0-9a-fA-F]+$/;
    const isFloat = /^-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?$/;
    if (value === undefined || value === null) {
        return value;
    }
    if (typeof value !== 'string') {
        throw new Error('The value to parse must always be of the string data type.');
    }
    // Boolean.
    if (value === 'true' || value === 'false') {
        return value === 'true';
    }
    let parsedValue = null;
    // Integer.
    if (isInteger.test(value)) {
        parsedValue = Number.parseInt(value, 10);
    }
    else if (isHex.test(value)) {
        parsedValue = Number.parseInt(value, 16);
    }
    // Float.
    else if (isFloat.test(value)) {
        parsedValue = Number.parseFloat(value);
    }
    if (parsedValue !== null && !isNaN(parsedValue)) {
        return parsedValue;
    }
    // Return as string.
    return value.toString();
};
