/* eslint-disable */

import { Kerdx, Database, Compression, AppLibrary } from 'kerdx';

const kerdx = new Kerdx();
let compressor = Compression();
let appLibrary = AppLibrary();
const api = {};

api.connect = params => {
    return appLibrary.ajax(params = { encode: true, data: {} }).then(result => {
        if (params.encode == undefined) params.encode = true;

        if (params.encode == true) {
            let sentence = JSON.stringify(params.data);
            let dictionary = kerdx.array.toSet(sentence.split('')).join('');
            let code = compressor.encodeLZW(sentence, dictionary);
            params.data = { code, dictionary, encoded: true };
        }

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
