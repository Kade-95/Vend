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

    return self;
}

let handler = Handlers();

function PostHandler() {
    let self = {};
    // self.sessions = kerds.sessionsManager.sessions;
    self.ignoreActive = ['login', 'createTenant'];
    self.appRequests = ['fetchApp', 'putApp', 'deleteApp'];
    self.adminOnly = ['createUser', 'makeAdmin', 'makeStaff', 'deleteUser'];
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
                dataHandler.respond(req, res, params.error);
            }
        }

        if (kerds.isset(self[action])) {
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
            dataHandler.respond(req, res, 'Unknown Request');
        }
    }

    self.isActive = (user) => {
        return global.sessions[user].active;
    }

    return self;
}

module.exports = { PostHandler };