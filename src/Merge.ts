import type { ConfigurationNode, IDataSource, IDataSourceInfo, Trace } from "wj-config";
import { forEachProperty, isArray, isConfigNode } from "./helpers.js";


type TraceRequest = {
    trace: Trace,
    dataSource: IDataSource
}

function mergeTwo(obj1: ConfigurationNode, obj2: ConfigurationNode, trace?: TraceRequest) {
    let recursiveTrace: TraceRequest | undefined;
    // Add the properties of obj2.
    forEachProperty(obj2, (key, value) => {
        const value1 = obj1[key];
        if (value1 !== undefined) {
            // If it is a scalar/array value, the value in object 2 must also be a scalar or array.
            // If it is an object value, then value in object 2 must also be an object.
            if (isConfigNode(value1) && !isConfigNode(value)) {
                throw new Error(`The destination value of property "${key}" is an object, but the second object is not providing an object value.`);
            }
            if (!isConfigNode(value1) && isConfigNode(value)) {
                throw new Error(`The destination value of property "${key}" is a scalar/array value, but the second object is not providing a scalar/array value.`);
            }
            if (isConfigNode(value1)) {
                // Recursively merge obj2 into obj1.
                if (trace) {
                    recursiveTrace = {
                        trace: (trace.trace[key] = trace.trace[key] ?? {}) as Trace,
                        dataSource: trace.dataSource
                    }
                }
                mergeTwo(value1, value, recursiveTrace);
            }
            else {
                obj1[key] = value;
                if (trace) {
                    trace.trace[key] = trace.dataSource.trace();
                }
            }
        }
        else {
            if (trace && isConfigNode(value)) {
                // Must trace, so merge.
                obj1[key] = {};
                recursiveTrace = {
                    trace: (trace.trace[key] = trace.trace[key] ?? {}) as Trace,
                    dataSource: trace.dataSource
                };
                mergeTwo((obj1[key] as ConfigurationNode), value, recursiveTrace);
            }
            else {
                obj1[key] = value;
                if (!isConfigNode(value) && trace) {
                    // Update the trace.
                    trace.trace[key] = trace.dataSource.trace();
                }
            }
        }
    });
    return obj1;
}

export default function merge(objects: ConfigurationNode[], dataSources?: IDataSource[]): ConfigurationNode & { _trace?: Trace; } {
    if (!isArray(objects)) {
        throw new Error('The provided value is not an array of objects.');
    }
    // There must be at least one object.
    if (objects.length === 0 || !isConfigNode(objects[0]) || objects[0] === null || objects[0] === undefined) {
        throw new Error('The first element of the array is required and must be a suitable configuration object.');
    }
    // If there are data sources, the number of these must match the number of provided objects.
    if (dataSources && objects.length !== dataSources?.length) {
        throw new Error('The number of provided objects differs from the number of provided data sources.');
    }
    let result: ConfigurationNode = objects[0];
    let initialIndex = 1;
    let trace: TraceRequest | undefined;
    if (dataSources) {
        result = {};
        initialIndex = 0;
        trace = {
            trace: {},
            dataSource: dataSources[0]
        };
    }
    for (let idx = initialIndex; idx < objects.length; ++idx) {
        let nextObject = objects[idx];
        // If null or undefined, just substitute for an empty object.
        if (nextObject === null || nextObject === undefined) {
            nextObject = {};
        }
        if (!isConfigNode(nextObject)) {
            throw new Error(`Configuration object at index ${idx} is not of the appropriate type.`);
        }
        if (trace) {
            trace.dataSource = (dataSources as IDataSource[])[idx];
        }
        mergeTwo(result, nextObject, trace);
    }
    if (trace) {
        (result as Trace)._trace = trace.trace;
    }
    return result;
}