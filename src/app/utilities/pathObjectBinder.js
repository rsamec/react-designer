'use strict';

var pathObjectBinder = (function () {
    function pathObjectBinder(sourceGetter) {
        this.sourceGetter = sourceGetter;
    }
    pathObjectBinder.prototype.getValue = function (path) {
        if (path === undefined)
            return this.sourceGetter();
        var parent = this.getParent(path);
        if (parent === undefined)
            return;
        var property = this.getProperty(path);
        return parent[property];
    };
    pathObjectBinder.prototype.setValue = function (path, value) {
        var parent = this.getParent(path);
        if (parent === undefined)
            return;
        var property = this.getProperty(path);
        parent[property] = value;
    };
    pathObjectBinder.prototype.getParent = function (path) {
        var last = path.lastIndexOf(".");
        var obj = this.sourceGetter();
        return last != -1 ? this.string_to_ref(obj, path.substring(0, last)) : obj;
    };
    pathObjectBinder.prototype.getProperty = function (path) {
        var last = path.lastIndexOf(".");
        return last != -1 ? path.substring(last + 1, path.length) : path;
    };
    pathObjectBinder.prototype.string_to_ref = function (obj, string) {
        if (obj === undefined) return undefined;
        var parts = string.split('.');

        //find square brackets (array-syntax]
        var arrayExp = /\[(\d*)\]/;
        var firstExp = parts[0];
        var matches = arrayExp.exec(firstExp);

        //try find existing instance
        var newObj = !!matches? obj[firstExp.replace(matches[0],"")][matches[1]]:obj[firstExp];

        //if no object found - initialize new objects -
        if (newObj === undefined) newObj = obj[parts[0]] = {};

        if (!parts[1]){
            return newObj
        }
        parts.splice(0, 1);
        var newString = parts.join('.');
        return this.string_to_ref(newObj, newString);
    };
    return pathObjectBinder;
})();
module.exports = pathObjectBinder;
