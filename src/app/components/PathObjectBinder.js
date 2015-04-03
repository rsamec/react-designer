/**
 * Created by rsamec on 1.3.2015.
 */

var PathObjectBinderBase = (function () {
    function PathObjectBinderBase(sourceGetter) {
        this.sourceGetter = sourceGetter;
    }
    PathObjectBinderBase.prototype.getValue = function (path) {
        if (path === undefined)
            return this.sourceGetter();
        var parent = this.getParent(path);
        if (parent === undefined)
            return;
        var property = this.getProperty(path);
        return parent[property];
    };
    PathObjectBinderBase.prototype.setValue = function (path, value) {
        var parent = this.getParent(path);
        if (parent === undefined)
            return;
        var property = this.getProperty(path);
        parent[property] = value;
    };
    PathObjectBinderBase.prototype.getParent = function (path) {
        var last = path.lastIndexOf(".");
        var obj = this.sourceGetter();
        return last != -1 ? this.string_to_ref(obj, path.substring(0, last)) : obj;
    };
    PathObjectBinderBase.prototype.getProperty = function (path) {
        var last = path.lastIndexOf(".");
        return last != -1 ? path.substring(last + 1, path.length) : path;
    };
    PathObjectBinderBase.prototype.string_to_ref = function (obj, string) {
        var parts = string.split('.');
        var newObj = obj[parts[0]];
        if (!parts[1]) {
            //if (newObj === undefined) newObj = obj[parts[0]] = {};
            return newObj;
        }
        if (newObj == undefined)
            return undefined;
        parts.splice(0, 1);
        var newString = parts.join('.');
        return this.string_to_ref(newObj, newString);
    };
    return PathObjectBinderBase;
})();
module.exports = PathObjectBinderBase;
