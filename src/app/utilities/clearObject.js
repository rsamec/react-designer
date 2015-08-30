import _ from 'lodash';

var cleanObjProps = function(obj){
    return cleanObjPropsEx(_.cloneDeep(obj));
}
var cleanObjPropsEx = function (obj) {
    for(var k in obj) {
        if(typeof obj[k] == "object"
            && obj[k] !== null
            && !(obj[k] instanceof Array)
            && !(obj[k] instanceof String)
            && !(obj[k] instanceof Number)) {

            cleanObjPropsEx(obj[k]);
            continue;
        }

        switch(typeof obj[k]) {
            case 'undefined':
            case 'boolean':
            case 'string':
            case 'number':
                obj[k] = undefined;
                break;
            default:
                obj[k] = [];
        }
    }
    return  obj;
};

export default cleanObjProps;
