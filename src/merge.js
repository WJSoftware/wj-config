'use strict';
const helpers = require('./helpers');

const merge = (obj1, obj2) => {
    const result = {};
    // Object 1 is required.
    // Object 2 is not required.
    // Both objects must be objects.
    if (!obj1) {
        throw new Error('Parameter 1 is required.');
    }
    if (!helpers.isObject(obj1)) {
        throw new Error('Argument 1 must be an object.');
    }
    // Shallow copy obj1.
    helpers.forEachProperty(obj1, (key, value) => {
        result[key] = value;
    });
    if (!obj2) {
        return result;
    }
    if (!helpers.isObject(obj2)) {
        throw new Error('Argument 2 must be an object.');
    }
    // Add the properties of obj2.
    helpers.forEachProperty(obj2, (key, value) => {
        const value1 = result[key];
        if (value1) {
            // If it is a scalar/array value, the value in object 2 must also be a scalar or array.
            // If it is an object value, then value in object 2 must also be an object.
            if (helpers.isObject(value1) && !helpers.isObject(value)) {
                throw new Error(`The destination value of property "${key}" is an object, but the second object is not providing an object value.`);
            }
            if (!helpers.isObject(value1) && helpers.isObject(value)) {
                throw new Error(`The destination value of property "${key}" is a scalar value, but the second object is not providing a scalar value.`);
            }
            // Recursively merge obj2 into the shallow copy of obj1.
            result[key] = helpers.isObject(value1) ? merge(value1, value) : value;
        }
        else {
            // Value is not set, so set it.
            result[key] = value;
        }
    });
    return result;
};

module.exports = merge;
