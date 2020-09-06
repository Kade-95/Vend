module.exports = function DataHanler() {
    let self = {};

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

    self.recycle = (params) => {
        params.options = { $set: { recycled: true, timeDeleted: new Date().getTime() } };
        return db.update(params);
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

    self.respond = (req, res, data = { status: false, message: null, payload: null }) => {
        data.payload = data.payload || null;
        data.message = data.message || null;
        data.status = data.status || false;
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