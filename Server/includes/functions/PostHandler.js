const DataHandler = require("./DataHandler");
const AdminsHandler = require("./AdminsHandler");
const UsersHandler = require("./UsersHandler");
const NegotiationsHandler = require("./NegotiationsHandler");
const NotificationsHandler = require("./NotificationsHandler");
const VendorsHandler = require("./VendorsHandler");

let dataHandler = DataHandler();
let usersHandler = UsersHandler();
let vendorHandler = VendorsHandler();
let negotiationsHandler = NegotiationsHandler();
let notificationsHandler = NotificationsHandler();
let adminsHandler = AdminsHandler();

function Handlers() {
    let self = {}

    for (let i in usersHandler) {
        if (typeof self[i] === 'undefined')
            self[i] = usersHandler[i];
    }

    for (let i in adminsHandler) {
        if (typeof self[i] === 'undefined')
            self[i] = adminsHandler[i];
    }

    for (let i in vendorHandler) {
        if (typeof self[i] === 'undefined')
            self[i] = vendorHandler[i];
    }

    for (let i in notificationsHandler) {
        if (typeof self[i] === 'undefined')
            self[i] = notificationsHandler[i];
    }

    for (let i in negotiationsHandler) {
        if (typeof self[i] === 'undefined')
            self[i] = negotiationsHandler[i];
    }

    self.find = (req, res, data) => {
        let params = JSON.parse(data.params);
        params = self.organizeData(params);
        let action = params.action;
        delete params.action;

        let prepareResult = result => {
            let preparedResult;
            if (!kerds.isnull(result)) {
                if (Array.isArray(result)) {
                    preparedResult = [];
                    for (let i in result) {
                        delete result[i].currentPassword;
                    }
                }
                else if (typeof result == 'object') {
                    delete result.currentPassword;
                }
            }
            preparedResult = result;

            return preparedResult
        }

        db.find(params).then(result => {
            self.respond(req, res, { status: true, payload: prepareResult(result) });
        });
    }

    self.removeFromRecycleBin = (req, res, data) => {
        db.delete({ collection: data.collection, query: { _id: new ObjectId(data.id) } }).then(result => {
            let status = result.result.ok == 1;
            let message = status ? 'Removed from Recyclebin' : 'Unable to remove from Recyclebin';
            dataHandler.respond(req, res, { status, message });
            dataHandler.makeHistory(req, status, { action: 'Removed From Recycle Bin', data, collection: data.collection, item: data.id });
        });
    }

    self.revert = (req, res, data) => {
        dataHandler.update({ collection: data.collection, query: { _id: new ObjectId(data.id) }, options: { $set: { recycled: false, timeReverted: new Date().getTime() } } }).then(result => {
            let status = result == 1;
            let message = status ? 'Deletion reverted' : 'Unable to revert deletion';
            dataHandler.respond(req, res, { status, message });

            dataHandler.makeHistory(req, result == 1, { action: `Reverted`, data, collection: data.collection, item: data.id });
        });
    }

    self.emptyRecycleBin = (req, res, data) => {
        kerds.runParallel({
            items: db.delete({ collection: 'items', query: { recycled: true }, many: true }),
            categories: db.delete({ collection: 'categories', query: { recycled: true }, many: true }),
            tags: db.delete({ collection: 'tags', query: { recycled: true }, many: true }),
            users: db.delete({ collection: 'users', query: { recycled: true }, many: true }),
            lists: db.delete({ collection: 'lists', query: { recycled: true }, many: true }),
            forms: db.delete({ collection: 'forms', query: { recycled: true }, many: true }),
            reports: db.delete({ collection: 'reports', query: { recycled: true }, many: true }),
            customforms: db.delete({ collection: 'customforms', query: { recycled: true }, many: true }),
            reportgenerators: db.delete({ collection: 'reportgenerators', query: { recycled: true }, many: true }),
        }, result => {
            dataHandler.respond(req, res, { status: true, message: 'Recyclebin emptied' });
            dataHandler.makeHistory(req, true, { action: 'Empty Recycle Bin', data, item: 'System' });
        });
    }

    return self;
}

let handler = Handlers();

function PostHandler() {
    let self = {};
    // self.sessions = kerds.sessionsManager.sessions;
    self.ignoreActive = ['login', 'createUser'];
    self.appRequests = ['fetchApp', 'putApp', 'deleteApp'];
    self.adminOnly = ['createAdmin', 'deleteUser'];
    self.domains = [
        'sharepoint.com'
    ];
    self.locals = [
        'https://localhost:4321'
    ];

    self.validateDomain = (req) => {
        let splitOrigin = req.headers.origin.split('.'),
            originLen = splitOrigin.length,
            splitDomain,
            domainLen,
            flag = false;

        for (let domain of self.domains) {
            splitDomain = domain.split('.');
            domainLen = splitDomain.length;
            flag = (splitOrigin[originLen - 1] == splitDomain[domainLen - 1] && splitOrigin[originLen - 2] == splitDomain[domainLen - 2]);
        }

        return flag;
    }

    self.act = (req, res, data) => {
        data = dataHandler.prepareData(data);
        let action = data.action;
        delete data.action;

        let deliver = (params) => {
            if (params.flag) {
                handler[action](req, res, data);
            }
            else {
                dataHandler.respond(req, res, { status: false, message: params.error });
            }
        }

        if (kerds.isset(handler[action])) {
            if (self.appRequests.includes(action)) {
                deliver({ error: 'Not Authorized', flag: self.locals.includes(req.headers.origin) || self.validateDomain(req) });
            }
            else if (self.ignoreActive.includes(action)) {
                deliver({ flag: true });
            }
            else {
                deliver({ error: 'Expired', flag: self.isActive(req.sessionId) });
            }
        }
        else {
            dataHandler.respond(req, res, { status: false, message: 'Unknown Request' });
        }
    }

    self.isActive = (user) => {
        return global.sessions[user].active;
    }

    return self;
}

module.exports = { PostHandler };