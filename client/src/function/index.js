 /* eslint-disable */

import { Kerdx } from 'Kerdx';
window.kerdx = new Kerdx();
const self = {};

self.get = params => {
    let data = { params: JSON.stringify(params) };
    data.action = 'find';
    return self.connect({ data });
}

self.connect = params => {
    return kerdx.api.ajax(params).then(result => {
        result = JSON.parse(result);

        if (result == 'Expired') {

        }
        else if (result == 'Admin only') {

        }
        else if (result == 'Unknown Request') {

        }
        else {
            return result;
        }
    }).catch(err => {
        reject(err);
    });
}

export default self;
