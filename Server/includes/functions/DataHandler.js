function DataHandler() {
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
                data = base.array.find(data, d => {
                    return d.recycled != true;
                });

                found = base.isset(data);

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
            if (base.isset(params.option)) {
                if (base.isset(params.options['$set'])) {
                    params.options['$set'].lastModified = new Date().getTime();
                }
                if (base.isset(params.options['$push'])) {
                    params.options['$push'].lastModified = new Date().getTime();
                }
                if (base.isset(params.options['$pull'])) {
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
        if (base.isset(params.query)) {
            if (base.isset(params.changeQuery)) {
                for (var i in params.changeQuery) {
                    if (base.isset(params.query[i])) {
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
            if (!base.isset(preparedData[i])) {

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

        if (base.isTruthy(preparedData.encoded)) {
            let decoded = compressor.decodeLZW(preparedData.code.split(','), preparedData.dictionary);

            try {
                preparedData = JSON.parse(decoded);
            } catch (error) {
                preparedData = decoded;
            }
        }

        return preparedData;
    }

    self.respond = (req, res, data = { status: false, message: null, payload: null }) => {
        data.payload = data.payload || null;
        data.message = data.message || null;
        data.status = data.status || false;
        let sentence = JSON.stringify(data);
        let dictionary = base.array.toSet(sentence.split('')).join('');

        let code = compressor.encodeLZW(sentence, dictionary);
        let encoded = JSON.stringify({ code, dictionary, encoded: true });

        let response = sentence < encoded ? sentence : encoded;
        res.end(response);
    }

    self.notify = (req, params) => {
        params.time = new Date().getTime();
        params.read = {};
        params.sent = {};

        db.insert({ collection: 'notifications', query: params });
    }

    return self;
}

module.exports = DataHandler;