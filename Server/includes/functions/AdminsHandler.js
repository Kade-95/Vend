const DataHandler = require("./DataHandler");
let dataHandler = DataHandler();

module.exports = function AdminsHandler() {
    let self = {};

    self.createAdmin = (req, res, data) => {
        bcrypt.hash(data.currentPassword, 10).then(hash => {
            data.currentPassword = hash;

            dataHandler.ifNotExist({ collection: 'admins', query: data, check: [{ userName: data.userName }, { email: data.email }], action: 'insert', getInserted: true }).then(result => {
                if (!base.isset(result.found)) {
                    let status = base.isset(result[0]);
                    let message = status ? 'User created Successfully' : 'Unable to Create Admin due to unknown error';
                    dataHandler.respond(req, res, { status, message });

                    dataHandler.makeHistory(req, status, { action: 'Admin Creation', data, collection: 'admins', item: result[0]._id.toString() });
                    db.find({ collection: 'admins', query: { userType: 'Admin' }, projection: { _id: 1 }, many: true }).then(admins => {
                        admins = server.array.each(admins, a => {
                            return a._id.toString();
                        });
                        dataHandler.notify(req, { title: 'Admin Created', note: 'A new admin has been added to the system.', link: `admins.html?page=showUser&id=${result[0]._id.toString()}`, users: admins });
                    });
                }
                else {
                    dataHandler.respond(req, res, { status: false, message: 'Admin is a duplicate', payload: result });
                }
            });
        });
    }

    return self;
}