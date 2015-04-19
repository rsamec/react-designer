'use strict';

/**
 * Create a deep-copied clone of the provided plain object. Any nested objects or arrays will be cloned either.
 *
 * @param from - source object
 * @param to - target object
 * @returns deep-cloned object
 */
function deepClone(from, to) {
    if (from == null || typeof from != "object") return from;
    if (from.constructor != Object && from.constructor != Array) return from;
    if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function ||
        from.constructor == String || from.constructor == Number || from.constructor == Boolean)
        return new from.constructor(from);

    to = to || new from.constructor();

    for (var name in from) {
        to[name] = typeof to[name] == "undefined" ? deepClone(from[name], null) : to[name];
    }

    return to;
}

module.exports =  deepClone;
