/* eslint-disable */

import { Func, ArrayLibrary, IndexedLibrary, Compression, AppLibrary } from 'kedio';
const func = new Func();
const arrayLib = ArrayLibrary();
const compressor = Compression();
const appLibrary = AppLibrary();
const api = {};

api.connect = params => {
    return appLibrary.ajax(params = { encode: true, data: {} }).then(result => {
        if (params.encode == undefined) params.encode = true;

        if (params.encode == true) {
            let sentence = JSON.stringify(params.data);
            let dictionary = arrayLib.toSet(sentence.split('')).join('');
            let code = compressor.encodeLZW(sentence, dictionary);
            params.data = { code, dictionary, encoded: true };
        }

        result = JSON.parse(result);
        if (func.isTruthy(result.encoded)) {
            result = JSON.parse(compressor.decodeLZW(result.code, result.dictionary));
        }
        return result;
    }).catch(err => {
        reject(err);
    });
}


export { api, IndexedLibrary };
