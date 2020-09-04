module.exports = function DataHanler() {
    let self = {};

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

        if (kerds.isset(action)) {
            self.respond(req, res, 'actioned');
        }
        else {
            db.find(params).then(result => {
                self.respond(req, res, prepareResult(result));
            });
        }
    }

    self.ifNotExist = (params) => {
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
                data = await db.find({ collection: params.collection, query: params.check[i], many: true });
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
                db[params.action](params).then(worked => {
                    resolve(worked);
                }).catch(error => {
                    reject(error)
                });
            }
        });
    }

    self.ifIExist = (params) => {
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

        return db.ifIExist(params);
    }

    self.insert = (params) => {
        params.query.timeCreated = new Date().getTime();
        params.query.lastModified = new Date().getTime();

        return db.insert(params);
    }

    self.save = (params) => {
        params.query.timeCreated = new Date().getTime();
        params.query.lastModified = new Date().getTime();

        return db.save(params);
    }

    self.delete = (params) => {
        return db.delete(params);
    }

    self.set = (params) => {
        params.options['$set'].lastModified = new Date().getTime();

        return db.update(params);
    }

    self.update = (params) => {
        params.options['$set'] = params.options['$set'] || { lastModified: new Date().getTime() };

        return db.update(params);
    }

    self.removeFromRecycleBin = (req, res, data) => {
        db.delete({ collection: data.collection, query: { _id: new ObjectId(data.id) } }).then(result => {
            self.respond(req, res, result.result.ok == 1);
            self.makeHistory(req, result.result.ok == 1, { action: 'Removed From Recycle Bin', data, collection: data.collection, item: data.id });
        });
    }

    self.recycle = (params) => {
        params.options = { $set: { recycled: true, timeDeleted: new Date().getTime() } };
        return db.update(params);
    }

    self.revert = (req, res, data) => {
        self.update({ collection: data.collection, query: { _id: new ObjectId(data.id) }, options: { $set: { recycled: false, timeReverted: new Date().getTime() } } }).then(result => {
            self.respond(req, res, (result == 1));
            self.makeHistory(req, result == 1, { action: `Reverted`, data, collection: data.collection, item: data.id });
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
            self.respond(req, res, true);
            self.makeHistory(req, true, { action: 'Empty Recycle Bin', data, item: 'System' });
        });
    }

    self.makeHistory = (req, flag, event) => {
        if (flag) {
            event.timeCreated = new Date().getTime();
            event.by = global.sessions[req.sessionId].user;
            db.insert({ collection: 'history', query: event });
        }
    }

    self.organizeData = (params) => {
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

    self.prepareData = (data) => {
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

    self.respond = (req, res, data) => {
        res.end(JSON.stringify(data));
    }
    
    self.notify = (req, params) => {
        params.time = new Date().getTime();
        params.read = {};
        params.sent = {};

        db.insert({ collection: 'notifications', query: params });
    }
    
    return self;
}