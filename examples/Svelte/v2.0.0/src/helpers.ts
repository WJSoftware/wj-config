export function isArray(obj: unknown): obj is Array<unknown> {
    return Array.isArray(obj);
};

export function isFunction(obj: unknown): obj is Function {
    return typeof obj === 'function'
}

export function isObject(obj: unknown): obj is Object {
    return typeof obj === 'object' && !isArray(obj);
}