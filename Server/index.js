'use strict'
let { Server, MongoLibrary, Func, Array, Compression } = require('kedio');
global.fs = require('fs');

const serverDetails = { address: 'test.vqusx.gcp.mongodb.net', user: 'me', password: '.June1995', name: 'vend' };

global.server = new Server();
global.base = new Func();
base.array = Array
global.compressor = new Compression();
global.db = MongoLibrary(serverDetails);
global.bcrypt = require('bcrypt');
global.ObjectId = require('mongodb').ObjectId;
global.sessions = server.sessionsManager.sessions;

let { PostHandler } = require('./includes/functions/PostHandler');

let postHandler = new PostHandler();

let { port, protocol } = server.getCommands('-');
if (!base.isset(port)) port = 8082;
if (!base.isset(protocol)) protocol = 'https';

server.createServer({
    port,
    protocol,
    allow: { origins: ['*'] },
    httpsOptions: {
        key: fs.readFileSync('./Server/permissions/server.key'),
        cert: fs.readFileSync('./Server/permissions/server.crt')
    },
    response: params => {
        params.response.end('View');
    }
});

server.recordSession({ period: 24 * 60 * 60 * 1000, remember: ['user'], server: serverDetails });

server.methods.post = (req, res, form) => postHandler.act(req, res, form);