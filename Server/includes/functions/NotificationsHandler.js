const DataHandler = require("./DataHandler");
let dataHandler = DataHandler();

module.exports = function NotifictionsHandler() {
    let self = {};

    self.getNotifications = (req, res, data) => {
        let notifications = [];
        let user = data.id || global.sessions[req.sessionId].user;
        db.find({ collection: 'notifications', query: {}, many: true }).then(found => {
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
            dataHandler.respond(req, res, notifications);
        });
    }

    self.sentNotification = (req, res, data) => {
        data.id = new ObjectId(data.id);
        db.find({ collection: 'notifications', query: { _id: data.id }, projection: { sent: 1, _id: 0 } }).then(note => {
            note.sent[global.sessions[req.sessionId].user] = new Date().getTime();
            dataHandler.set({ collection: 'notifications', query: { _id: data.id }, options: { '$set': { sent: note.sent } } }).then(read => {
                dataHandler.respond(req, res, read == 1);
            });
        });
    }

    self.readNotification = (req, res, data) => {
        data.id = new ObjectId(data.id);
        db.find({ collection: 'notifications', query: { _id: data.id }, projection: { read: 1, _id: 0 } }).then(note => {
            note.read[global.sessions[req.sessionId].user] = new Date().getTime();
            dataHandler.set({ collection: 'notifications', query: { _id: data.id }, options: { '$set': { read: note.read } } }).then(read => {
                dataHandler.respond(req, res, read == 1);
            });
        });
    }

    return self;
}