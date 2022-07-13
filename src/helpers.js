'use strict';
const isArray = obj => Array.isArray(obj);

const isObject = obj => typeof obj === 'object' && !isArray(obj);

const isFunction = obj => typeof obj === 'function';

const forEachProperty = (obj, loopBody) => {
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

const attemptParse = value => {
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
    if (parsedValue !== NaN && parsedValue !== null) {
        return parsedValue;
    }
    // Return as string.
    return value.toString();
};

module.exports = {
    isObject: isObject,
    isFunction: isFunction,
    isArray: isArray,
    forEachProperty: forEachProperty,
    attemptParse: attemptParse
};
