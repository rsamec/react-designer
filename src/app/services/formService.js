import request from 'superagent';
import Promise from 'promise';

class formService {
    constructor(url){
        this.url = url;
    }
    getSchemaList() {
        var url = this.url;
        return new Promise(function (resolve, reject) {
            request.get(url + '/publisher/assets/schemas/list.json')
                .end(function (err, res) {
                    if (res.ok) return resolve(res.body);
                    else reject(err)
                })
        });
    }

    getSchema(id) {
        var url = this.url;
        return new Promise(function (resolve, reject) {
            request.get(url + '/publisher/assets/schemas/' + id + '.json')
                .end(function (err, res) {
                    if (res.ok) return resolve(res.body);
                    else reject(err)
                })
        });
    }
    publishSchema(schema){
        var url = this.url;
        return new Promise(function (resolve, reject) {
            request
                .post(url + '/publish')
                .send(schema)
                .set('Accept', 'application/json')
                .end(function (err, res) {
                    if (res.ok) return resolve(res.body);
                    else reject(err)
                })
        });
    }


}

//export default new formService('http://hand-formvalidation.rhcloud.com');
export default new formService('');
