const { ObjectID } = require("mongodb");

class PostHandler {

    constructor() {
        this.sessions = kerds.sessionsManager.sessions;
        this.ignoreActive = ['login', 'createTenant'];
        this.appRequests = ['fetchApp', 'putApp', 'deleteApp'];
        this.adminOnly = ['createUser', 'makeAdmin', 'makeStaff', 'deleteUser'];
        this.domains = [
            'sharepoint.com'
        ];
        this.locals = [
            'https://localhost:4321'
        ];
    }

    validateDomain(req) {
        let splitOrigin = req.headers.origin.split('.'),
            originLen = splitOrigin.length,
            splitDomain,
            domainLen,
            flag = false;

        for (let domain of this.domains) {
            splitDomain = domain.split('.');
            domainLen = splitDomain.length;
            flag = (splitOrigin[originLen - 1] == splitDomain[domainLen - 1] && splitOrigin[originLen - 2] == splitDomain[domainLen - 2]);
        }

        return flag;
    }

    act(req, res, data) {
        data = this.prepareData(data);
        let action = data.action;
        delete data.action;

        let deliver = (params) => {
            if (params.flag) {
                this[action](req, res, data);
            }
            else {
                this.respond(req, res, params.error);
            }
        }

        if (kerds.isset(this[action])) {
            if (this.appRequests.includes(action)) {
                deliver({ error: 'Not Authorized', flag: this.locals.includes(req.headers.origin) || this.validateDomain(req) });
            }
            else if (this.ignoreActive.includes(action)) {
                deliver({ flag: true });
            }
            else {
                deliver({ error: 'Expired', flag: this.isActive(req.sessionId) });
            }
        }
        else {
            this.respond(req, res, 'Unknown Request');
        }
    }

    ifNotExist(req, params) {
        if (params.action == 'insert') {
            params.query.timeCreated = new Date().getTime();
            params.query.lastModified = new Date().getTime();
        }
        else if (params.action == 'update') {
            params.query.lastModified = new Date().getTime();
        }
        return new Promise(async (resolve, reject) => {
            let data, found;
            for (let i = 0; i < params.check.length; i++) {
                data = await global.sessions[req.sessionId].db.find({ collection: params.collection, query: params.check[i], many: true });
                data = kerds.array.find(data, d => {
                    return d.recycled != true;
                });

                found = kerds.isset(data);

                if (found) {
                    resolve({ found: Object.keys(params.check[i]) });
                    break
                }
            }
            if (!found) {
                global.sessions[req.sessionId].db[params.action](params).then(worked => {
                    resolve(worked);
                }).catch(error => {
                    reject(error)
                });
            }
        });
    }

    ifIExist(req, params) {
        if (params.action == 'update') {
            if (kerds.isset(params.option)) {
                if (kerds.isset(params.options['$set'])) {
                    params.options['$set'].lastModified = new Date().getTime();
                }
                if (kerds.isset(params.options['$push'])) {
                    params.options['$push'].lastModified = new Date().getTime();
                }
                if (kerds.isset(params.options['$pull'])) {
                    params.options['$pull'].lastModified = new Date().getTime();
                }
            }
        }

        return global.sessions[req.sessionId].db.ifIExist(params);
    }

    insert(req, params) {
        params.query.timeCreated = new Date().getTime();
        params.query.lastModified = new Date().getTime();

        return global.sessions[req.sessionId].db.insert(params);
    }

    save(req, params) {
        params.query.timeCreated = new Date().getTime();
        params.query.lastModified = new Date().getTime();

        return global.sessions[req.sessionId].db.save(params);
    }

    delete(req, params) {
        return global.sessions[req.sessionId].db.delete(params);
    }

    set(req, params) {
        params.options['$set'].lastModified = new Date().getTime();

        return global.sessions[req.sessionId].db.update(params);
    }

    pull(req, params) {
        return global.sessions[req.sessionId].db.update(params);
    }

    push(req, params) {
        return global.sessions[req.sessionId].db.update(params);
    }

    update(req, params) {
        params.options['$set'] = params.options['$set'] || { lastModified: new Date().getTime() };

        return global.sessions[req.sessionId].db.update(params);
    }

    removeFromRecycleBin(req, res, data) {
        global.sessions[req.sessionId].db.delete({ collection: data.collection, query: { _id: new ObjectId(data.id) } }).then(result => {
            this.respond(req, res, result.result.ok == 1);
            this.makeHistory(req, result.result.ok == 1, { action: 'Removed From Recycle Bin', data, collection: data.collection, item: data.id });
        })
    }

    recycle(req, params) {
        params.options = { $set: { recycled: true, timeDeleted: new Date().getTime() } };
        return global.sessions[req.sessionId].db.update(params);
    }

    revert(req, res, data) {
        this.update(req, { collection: data.collection, query: { _id: new ObjectId(data.id) }, options: { $set: { recycled: false, timeReverted: new Date().getTime() } } }).then(result => {
            this.respond(req, res, (result == 1));
            this.makeHistory(req, result == 1, { action: `Reverted`, data, collection: data.collection, item: data.id });
        });
    }

    emptyRecycleBin(req, res, data) {
        kerds.runParallel({
            items: global.sessions[req.sessionId].db.delete({ collection: 'items', query: { recycled: true }, many: true }),
            categories: global.sessions[req.sessionId].db.delete({ collection: 'categories', query: { recycled: true }, many: true }),
            tags: global.sessions[req.sessionId].db.delete({ collection: 'tags', query: { recycled: true }, many: true }),
            users: global.sessions[req.sessionId].db.delete({ collection: 'users', query: { recycled: true }, many: true }),
            lists: global.sessions[req.sessionId].db.delete({ collection: 'lists', query: { recycled: true }, many: true }),
            forms: global.sessions[req.sessionId].db.delete({ collection: 'forms', query: { recycled: true }, many: true }),
            reports: global.sessions[req.sessionId].db.delete({ collection: 'reports', query: { recycled: true }, many: true }),
            customforms: global.sessions[req.sessionId].db.delete({ collection: 'customforms', query: { recycled: true }, many: true }),
            reportgenerators: global.sessions[req.sessionId].db.delete({ collection: 'reportgenerators', query: { recycled: true }, many: true }),
        }, result => {
            this.respond(req, res, true);
            this.makeHistory(req, true, { action: 'Empty Recycle Bin', data, item: 'System' });
        });
    }

    login(req, res, data) {
        let [userName, account] = data.email.split('@');
        account = account.slice(0, account.lastIndexOf('.')).replace('.', '#');
        global.sessions[req.sessionId].db.name = account;
        console.log(account, userName);
        global.sessions[req.sessionId].db.find({ collection: 'users', query: { userName: userName }, projection: { currentPassword: 1, userType: 1, fullName: 1, userImage: 1 } }).then(result => {
            if (!kerds.isnull(result)) {
                bcrypt.compare(data.currentPassword, result.currentPassword).then(valid => {
                    if (valid) {
                        this.respond(req, res, { user: result._id, userType: result.userType, fullName: result.fullName, image: result.userImage });
                        global.sessions[req.sessionId].set({ user: ObjectId(result._id).toString(), active: true, account });
                    }
                    else {
                        this.respond(req, res, 'Incorrect')
                    }
                });
            }
            else {
                this.respond(req, res, '404')
            }
        });
    }

    makeHistory(req, flag, event) {
        if (flag) {
            event.timeCreated = new Date().getTime();
            event.by = global.sessions[req.sessionId].user;
            global.sessions[req.sessionId].db.insert({ collection: 'history', query: event });
        }
    }

    createUser(req, res, data) {
        bcrypt.hash(data.currentPassword, 10).then(hash => {
            data.currentPassword = hash;

            this.ifNotExist(req, { collection: 'users', query: data, check: [{ userName: data.userName }, { email: data.email }], action: 'insert', getInserted: true }).then(result => {
                if (!kerds.isset(result.found)) {
                    this.respond(req, res, kerds.isset(result[0]));
                    this.makeHistory(req, kerds.isset(result[0]), { action: 'User Creation', data, collection: 'users', item: result[0]._id.toString() });
                    if (data.userType == 'Admin') {
                        this.notify(req, { title: 'User type Change', note: 'You are now an Admin', users: [result[0]._id.toString()] });

                        global.sessions[req.sessionId].db.find({ collection: 'users', query: { userType: 'Admin' }, projection: { _id: 1 }, many: true }).then(admins => {
                            admins = kerds.array.each(admins, a => {
                                return a._id.toString();
                            });
                            this.notify(req, { title: 'Admin Created', note: 'A new admin has been added to the system.', link: `users.html?page=showUser&id=${result[0]._id.toString()}`, users: admins });
                        });
                    }
                }
                else {
                    this.respond(req, res, result);
                }
            });
        });
    }

    makeAdmin(req, res, data) {
        this.set(req, { collection: 'users', query: { _id: ObjectId(data.user) }, options: { '$set': { userType: 'Admin' } } }).then(result => {
            this.respond(req, res, result == 1);
            data.by = global.sessions[req.sessionId].user;
            this.makeHistory(req, result == 1, { action: 'Become Admin', data, collection: 'users', item: data.user });

            this.notify(req, { title: 'User type Change', note: 'You are now an Admin', users: [data.user] });

            global.sessions[req.sessionId].db.find({ collection: 'users', query: { userType: 'Admin' }, projection: { _id: 1 }, many: true }).then(admins => {
                admins = kerds.array.each(admins, a => {
                    return a._id.toString();
                });

                this.notify(req, { title: 'Admin Created', note: 'A new admin has been added to the system.', link: `users.html?page=showUser&id=${data.user}`, users: admins });
            });
        });
    }

    makeStaff(req, res, data) {
        this.set(req, { collection: 'users', query: { _id: ObjectId(data.user) }, options: { '$set': { userType: 'Staff' } } }).then(result => {
            this.respond(req, res, result == 1);
            data.by = global.sessions[req.sessionId].user;
            this.makeHistory(req, result == 1, { action: 'Become Staff', data, collection: 'users', item: data.user });

            if (result == 1) {
                this.notify(req, { title: 'User type Change', note: 'You are no longer an Admin', users: [data.user] });

                global.sessions[req.sessionId].db.find({ collection: 'users', query: { userType: 'Admin' }, projection: { _id: 1 }, many: true }).then(admins => {
                    admins = kerds.array.each(admins, a => {
                        return a._id.toString();
                    });

                    this.notify(req, { title: 'Admin Removal', note: 'An admin has been removed from the system system.', link: '', users: admins });
                });
            }
        });
    }

    tourUser(req, res, data) {
        data.user = global.sessions[req.sessionId].user;
        this.set(req, { collection: 'users', query: { _id: ObjectId(data.user) }, options: { '$set': { toured: true } } }).then(result => {
            this.respond(req, res, result == 1);
        });
    }

    deleteUser(req, res, data) {
        this.recycle(req, { collection: 'users', query: { _id: ObjectId(data.user) } }).then(result => {
            this.respond(req, res, (result == 1));
            this.makeHistory(req, result == 1, { action: 'Delete User', data, collection: 'users', item: data.user });
        });
    }

    isActive(user) {
        return global.sessions[user].active;
    }

    isUserActive(req, res, data) {
        let active = false;
        for (let id in global.sessions) {
            if (global.sessions[id].user == data.user) {
                active = global.sessions[id].active;
                if (active) break;
            }
        }
        this.respond(req, res, active);
    }

    find(req, res, data) {
        let params = JSON.parse(data.params);
        params = this.organizeData(params);
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

        if (kerds.isset(action)) {
            this.respond(req, res, 'actioned');
        }
        else {
            global.sessions[req.sessionId].db.find(params).then(result => {
                this.respond(req, res, prepareResult(result));
            });
        }
    }

    organizeData(params) {
        if (kerds.isset(params.query)) {
            if (kerds.isset(params.changeQuery)) {
                for (var i in params.changeQuery) {
                    if (kerds.isset(params.query[i])) {
                        if (params.changeQuery[i] == 'objectid') {
                            params.query[i] = new ObjectId(params.query[i]);
                        }
                    }
                }
            }
        }
        return params;
    }

    prepareData(data) {
        let preparedData = {};
        let value;
        for (let i in data) {
            if (!kerds.isset(preparedData[i])) {

                if (data[i].filename != '') {
                    value = data[i];
                }
                else {
                    value = data[i].value.toString();
                    if (value == '[object Object]') {
                        value = data[i];
                    }
                }
                preparedData[i] = value;
            }
        }

        return preparedData;
    }

    respond(req, res, data) {
        res.end(JSON.stringify(data));
    }

    logout(req, res, data) {
        let id = req.sessionId;
        if (kerds.isset(data.id)) {
            id = data.id;
        }
        kerds.sessionsManager.destroy(id).then(done => {
            this.respond(req, res, true);
        });
    }

    changeDp(req, res, data) {
        let userPath = `./users/${req.sessionId}`;
        let userImage = `./users/${req.sessionId}/dp.png`;

        let uploadImage = () => {
            fs.writeFile(userImage, data.newImage.value, c => {
                this.set(req, { collection: 'users', query: { _id: new ObjectId(global.sessions[req.sessionId].user) }, options: { '$set': { userImage: userImage } } }).then(result => {
                    this.respond(req, res, result == 1);

                    this.makeHistory(req, result == 1, { action: 'Change Profile Picture', data, collection: 'users', item: global.sessions[req.sessionId].user });

                });
            });
        }

        fs.exists(userPath, foundUser => {
            if (!foundUser) {
                fs.mkdir(userPath, { recursive: true }, () => {
                    uploadImage();
                });
            }
            else {
                uploadImage();
            }
        });
    }

    deleteDp(req, res, data) {
        this.set(req, { collection: 'users', query: { _id: new ObjectId(global.sessions[req.sessionId].user) }, options: { '$set': { userImage: null } } }).then(result => {
            kerds.deleteRecursive(`./users/${global.sessions[req.sessionId].user}/dp.png`, () => {
                this.respond(req, res, result == 1);
                this.makeHistory(req, result == 1, { action: 'Delete Profile Picture', data, collection: 'users', item: global.sessions[req.sessionId].user });
            });
        });
    }

    editProfile(req, res, data) {
        data.lastModified = new Date().getTime();
        this.set(req, { collection: 'users', query: { _id: new ObjectId(global.sessions[req.sessionId].user) }, options: { '$set': data } }).then(result => {
            this.respond(req, res, result == 1);
            this.makeHistory(req, result == 1, { action: 'Edit Profile', data, collection: 'users', item: global.sessions[req.sessionId].user });
        });
    }

    editUser(req, res, data) {
        let id = data._id;
        delete data._id;
        data.lastModified = new Date().getTime();
        this.set(req, { collection: 'users', query: { _id: new ObjectId(id) }, options: { '$set': data } }).then(result => {
            this.respond(req, res, result == 1);
            this.makeHistory(req, result == 1, { action: 'Edit User', data, item: 'users', item: id });
        });
    }

    changePassword(req, res, data) {
        global.sessions[req.sessionId].db.find({ collection: 'users', query: { _id: new ObjectId(global.sessions[req.sessionId].user) }, projection: { currentPassword: 1 } }).then(result => {
            if (!kerds.isnull(result)) {
                bcrypt.compare(data.currentPassword, result.currentPassword).then(valid => {
                    if (valid) {
                        bcrypt.hash(data.newPassword, 10).then(hash => {
                            data.newPassword = hash;
                            this.set(req, { collection: 'users', query: { _id: new ObjectId(global.sessions[req.sessionId].user) }, options: { '$set': { currentPassword: data.newPassword } } }).then(changed => {
                                this.respond(req, res, true);
                                this.makeHistory(req, true, { action: 'Change Password', data, collection: 'users', item: global.sessions[req.sessionId].user });
                            });
                        });
                    }
                    else {
                        this.respond(req, res, false);
                    }
                });
            }
            else {
                this.respond(req, res, '404');
            }
        });
    }

    search(req, res, data) {
        let found = { items: [], users: [], categories: [], tags: [], lists: [] };
        let query = data.query.toLowerCase();

        kerds.runParallel({

        }, result => {
            return new Promise((resolve, reject) => {
                for (let collection in result) {
                    for (let item of result[collection]) {
                        if (JSON.stringify(item).toLowerCase().includes(query)) {
                            if (collection == 'users') {
                                found[collection].push({ _id: item._id, name: item.userName, image: item.userImage });
                            }
                            else if (collection == 'items') {
                                found[collection].push({ _id: item._id, name: item.name, image: item.image });
                            }
                            else if (collection == 'categories') {
                                found[collection].push({ _id: item._id, name: item.name, image: item.image });
                            }
                            else if (collection == 'tags') {
                                found[collection].push({ _id: item._id, name: item.name, image: item.image });
                            }
                            else if (collection == 'list') {
                                found[collection].push({ _id: item._id, name: item.name });
                            }
                        }
                    }
                }
                this.respond(req, res, found);
                resolve(found);
            });
        });
    }

    notify(req, params) {
        params.time = new Date().getTime();
        params.read = {};
        params.sent = {};

        global.sessions[req.sessionId].db.insert({ collection: 'notifications', query: params });
    }

    getNotifications(req, res, data) {
        let notifications = [];
        let user = data.id || global.sessions[req.sessionId].user;
        global.sessions[req.sessionId].db.find({ collection: 'notifications', query: {}, many: true }).then(found => {
            for (let i = 0; i < found.length; i++) {
                if (found[i].users.includes(user)) {
                    found[i].status = kerds.isset(found[i].read[user]) ? 'Read' : 'UnRead';
                    found[i].delivered = kerds.isset(found[i].sent[user]);
                    delete found[i].read;
                    delete found[i].sent;
                    if (data.flag == 'unsent') {
                        if (!found[i].delivered) {
                            notifications.push(found[i]);
                        }
                    }
                    else if (data.flag == 'unread') {
                        if (found[i].status == 'UnRead') {
                            notifications.push(found[i]);
                        }
                    }
                    else {
                        notifications.push(found[i]);
                    }
                }
            }
            this.respond(req, res, notifications);
        });
    }

    sentNotification(req, res, data) {
        data.id = new ObjectId(data.id);
        global.sessions[req.sessionId].db.find({ collection: 'notifications', query: { _id: data.id }, projection: { sent: 1, _id: 0 } }).then(note => {
            note.sent[global.sessions[req.sessionId].user] = new Date().getTime();
            this.set(req, { collection: 'notifications', query: { _id: data.id }, options: { '$set': { sent: note.sent } } }).then(read => {
                this.respond(req, res, read == 1);
            });
        });
    }

    readNotification(req, res, data) {
        data.id = new ObjectId(data.id);
        global.sessions[req.sessionId].db.find({ collection: 'notifications', query: { _id: data.id }, projection: { read: 1, _id: 0 } }).then(note => {
            note.read[global.sessions[req.sessionId].user] = new Date().getTime();
            this.set(req, { collection: 'notifications', query: { _id: data.id }, options: { '$set': { read: note.read } } }).then(read => {
                this.respond(req, res, read == 1);
            });
        });
    }
}

module.exports = { PostHandler };