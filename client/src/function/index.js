/* eslint-disable */

import { Kerdx, Database, Compression } from 'Kerdx';
import { UserManager } from './UserManager.js';

const kerdx = new Kerdx();
let compressor = Compression();

const api = {};

api.connect = params => {
    return kerdx.api.ajax(params).then(result => {
        result = JSON.parse(result);
        result = JSON.parse(result);
        if (result.encoder == 'LZW') {
            result = JSON.parse(compressor.decodeLZW(result.code, result.dictionary));
        }
        return result;
    }).catch(err => {
        reject(err);
    });
}


export { api, kerdx, userManager, Database };
