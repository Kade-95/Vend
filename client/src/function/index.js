/* eslint-disable */

import { Kerdx } from 'Kerdx';
import {UserManager} from './UserManager.js';

const kerdx = new Kerdx();
const api = {};
const userManager = new UserManager(kerdx, api);

api.connect = params => {
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

api.get = params => {
    let data = { params: JSON.stringify(params) };
    data.action = 'find';
    return api.connect({ data });
}

api.ping = () => {
    let data = { action: 'ping' };
    return api.connect({ data });
}

api.init = ()=>{
    document.addEventListener('DOMContentLoaded', event=>{
        
    });
}

export { api, kerdx, userManager };
