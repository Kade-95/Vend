const DataHandler = require("./DataHandler");
let dataHandler = DataHandler();

module.exports = function UsersHandler() {
    let self = {};

    self.createUser = (req, res, data) => {
        bcrypt.hash(data.currentPassword, 10).then(hash => {
            data.currentPassword = hash;

            dataHandler.ifNotExist({ collection: 'users', query: data, check: [{ userName: data.userName }, { email: data.email }], action: 'insert', getInserted: true }).then(result => {
                if (!kerds.isset(result.found)) {
                    let status = kerds.isset(result[0]._id);
                    let message = 'Unable to Create User due to unknown error';
                    let payload;
                    if (status) {
                        payload = { user: result[0]._id };
                        message = 'User created Successfully';
                    }

                    dataHandler.respond(req, res, { status, message, payload });

                    dataHandler.makeHistory(req, status, { action: 'User Creation', data, collection: 'users', item: result[0]._id.toString() });
                    if (data.userType == 'Admin') {
                        dataHandler.notify(req, { title: 'User type Change', note: 'You are now an Admin', users: [result[0]._id.toString()] });

                        db.find({ collection: 'users', query: { userType: 'Admin' }, projection: { _id: 1 }, many: true }).then(admins => {
                            admins = kerds.array.each(admins, a => {
                                return a._id.toString();
                            });
                            dataHandler.notify(req, { title: 'Admin Created', note: 'A new admin has been added to the system.', link: `users.html?page=showUser&id=${result[0]._id.toString()}`, users: admins });
                        });
                    }
                }
                else {
                    if (result.found.includes('email')) {
                        dataHandler.respond(req, res, { status: false, message: 'Email is already in use', payload: result });
                    }
                    else if ('userName') {
                        dataHandler.respond(req, res, { status: false, message: 'Username is already in use', payload: result });
                    }
                }
            });
        });
    }

    self.login = (req, res, data) => {
        db.find({ collection: 'users', query: { userName: data.userName }, projection: { currentPassword: 1, userType: 1, fullName: 1, userImage: 1 } }).then(result => {
            if (!kerds.isnull(result)) {
                bcrypt.compare(data.currentPassword, result.currentPassword).then(valid => {
                    if (valid) {
                        dataHandler.respond(req, res, { status: true, payload: { user: result._id } });
                        global.sessions[req.sessionId].set({ user: ObjectId(result._id).toString(), active: true });
                    }
                    else {
                        dataHandler.respond(req, res, { status: false, message: 'Incorrect username or password' })
                    }
                });
            }
            else {
                dataHandler.respond(req, res, { status: false, message: 'Incorrect username or password' });
            }
        });
    }

    self.isUserActive = (req, res, data) => {
        let active = false;
        for (let id in global.sessions) {
            if (global.sessions[id].user == data.user) {
                active = global.sessions[id].active;
                if (active) break;
            }
        }
        dataHandler.respond(req, res, { status: true, payload: active });
    }

    self.banUser = (req, res, data) => {
        let banTime = new Date().getTime();
        dataHandler.set({ collection: 'users', query: { _id: ObjectId(data.user) }, options: { '$set': { banned: true, banReason: data.reason, banTime } } }).then(result => {
            let status = result == 1;
            let message = status ? `User ${data.user} banned` : 'Unable to ban user';
            dataHandler.respond(req, res, { status, message });

            data.by = global.sessions[req.sessionId].user;
            dataHandler.makeHistory(req, status, { action: 'User Banned', data, collection: 'users', item: data.user });

            dataHandler.notify(req, { title: 'User Banned', note: 'You are banned from using Vend', users: [data.user] });

            db.find({ collection: 'users', query: { userType: 'Admin' }, projection: { _id: 1 }, many: true }).then(admins => {
                admins = kerds.array.each(admins, a => {
                    return a._id.toString();
                });

                dataHandler.notify(req, { title: 'User Banned', note: 'A user was banned from using the system.', link: `users.html?page=showUser&id=${data.user}`, users: admins });
            });
        });
    }

    self.suspendUser = (req, res, data) => {
        dataHandler.set({ collection: 'users', query: { _id: ObjectId(data.user) }, options: { '$set': { suspended: true, suspensionReason: data.reason, suspensionTime: data.time, suspensionDuration: data.duration } } }).then(result => {
            let status = result == 1;
            let message = status ? `User ${data.user} suspended` : 'Unable to suspend user';
            dataHandler.respond(req, res, { status, message });

            data.by = global.sessions[req.sessionId].user;
            dataHandler.makeHistory(req, status, { action: 'User Suspended', data, collection: 'users', item: data.user });

            dataHandler.notify(req, { title: 'User Suspended', note: 'You are suspended from using Vend', users: [data.user] });

            db.find({ collection: 'users', query: { userType: 'Admin' }, projection: { _id: 1 }, many: true }).then(admins => {
                admins = kerds.array.each(admins, a => {
                    return a._id.toString();
                });

                dataHandler.notify(req, { title: 'User Suspended', note: 'A user was suspended from using the system.', link: `users.html?page=showUser&id=${data.user}`, users: admins });
            });
        });
    }

    self.unbanUser = (req, res, data) => {
        dataHandler.set({ collection: 'users', query: { _id: ObjectId(data.user) }, options: { '$set': { banned: false } } }).then(result => {
            let status = result == 1;
            let message = status ? `User ${data.user} ban lifted` : `Unable to lift user's ban`;
            dataHandler.respond(req, res, { status, message });

            data.by = global.sessions[req.sessionId].user;
            dataHandler.makeHistory(req, result == 1, { action: 'User Ban Revoked', data, collection: 'users', item: data.user });

            dataHandler.notify(req, { title: 'User Ban Revoked', note: 'Your ban has been lifted', users: [data.user] });

            db.find({ collection: 'users', query: { userType: 'Admin' }, projection: { _id: 1 }, many: true }).then(admins => {
                admins = kerds.array.each(admins, a => {
                    return a._id.toString();
                });

                dataHandler.notify(req, { title: 'User Ban Revoked', note: `A user's ban has been lifted`, link: `users.html?page=showUser&id=${data.user}`, users: admins });
            });
        });
    }

    self.unsuspendUser = (req, res, data) => {
        dataHandler.set({ collection: 'users', query: { _id: ObjectId(data.user) }, options: { '$set': { suspended: true } } }).then(result => {
            let status = result == 1;
            let message = status ? `User ${data.user} suspension lifted` : `Unable to lift user's suspension`;
            dataHandler.respond(req, res, { status, message });

            data.by = global.sessions[req.sessionId].user;
            dataHandler.makeHistory(req, result == 1, { action: 'User Suspension Lifted', data, collection: 'users', item: data.user });

            dataHandler.notify(req, { title: 'User Suspension Lifted', note: 'Your suspension has been lifted', users: [data.user] });

            db.find({ collection: 'users', query: { userType: 'Admin' }, projection: { _id: 1 }, many: true }).then(admins => {
                admins = kerds.array.each(admins, a => {
                    return a._id.toString();
                });

                dataHandler.notify(req, { title: 'User Suspension Lifted', note: `A user's suspension has been lifted`, link: `users.html?page=showUser&id=${data.user}`, users: admins });
            });
        });
    }

    self.tourUser = (req, res, data) => {
        data.user = global.sessions[req.sessionId].user;
        dataHandler.set({ collection: 'users', query: { _id: ObjectId(data.user) }, options: { '$set': { toured: true } } }).then(result => {
            let status = result == 1;
            let message = status ? `User tour flag set` : `Unable to set user tour flag`;
            dataHandler.respond(req, res, { status, message });
        });
    }

    self.deleteUser = (req, res, data) => {
        dataHandler.recycle(req, { collection: 'users', query: { _id: ObjectId(data.user) } }).then(result => {
            let status = result == 1;
            let message = status ? `User ${data.user} deleted` : `Unable to delete user`;
            dataHandler.respond(req, res, { status, message });

            dataHandler.makeHistory(req, result == 1, { action: 'Delete User', data, collection: 'users', item: data.user });
        });
    }

    self.logout = (req, res, data) => {
        let id = req.sessionId;
        if (kerds.isset(data.user)) {
            id = data.user;
        }
        kerds.sessionsManager.destroy(id).then(done => {
            dataHandler.respond(req, res, { status: true, message: 'You logged out' });
        });
    }

    self.changeDp = (req, res, data) => {
        let userPath = `./users/${req.sessionId}`;
        let userImage = `./users/${req.sessionId}/dp.png`;
        let user = global.sessions[req.sessionId].user;

        let uploadImage = () => {
            fs.writeFile(userImage, data.newImage.value, c => {
                dataHandler.set({ collection: 'users', query: { _id: new ObjectId(user) }, options: { '$set': { userImage: userImage } } }).then(result => {
                    let status = result == 1;
                    let message = status ? `User dp updated` : `Unable to update user dp`;
                    dataHandler.respond(req, res, { status, message });

                    dataHandler.makeHistory(req, result == 1, { action: 'Change Profile Picture', data, collection: 'users', item: user });
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

    self.deleteDp = (req, res, data) => {
        let user = global.sessions[req.sessionId].user;
        dataHandler.set({ collection: 'users', query: { _id: new ObjectId(user) }, options: { '$set': { userImage: null } } }).then(result => {
            kerds.deleteRecursive(`./users/${user}/dp.png`, () => {
                let status = result == 1;
                let message = status ? `User dp deleted` : `Unable to delete user dp`;
                dataHandler.respond(req, res, { status, message });

                dataHandler.makeHistory(req, result == 1, { action: 'Delete Profile Picture', data, collection: 'users', item: user });
            });
        });
    }

    self.editProfile = (req, res, data) => {
        data.lastModified = new Date().getTime();
        delete data.currentPassword;
        let user = global.sessions[req.sessionId].user;
        dataHandler.set({ collection: 'users', query: { _id: new ObjectId(user) }, options: { '$set': data } }).then(result => {
            let status = result == 1;
            let message = status ? `User Profile edited` : `Unable to edit user profile`;
            dataHandler.respond(req, res, { status, message });

            dataHandler.makeHistory(req, result == 1, { action: 'Edit Profile', data, collection: 'users', item: user });
        });
    }

    self.changePassword = (req, res, data) => {
        let user = global.sessions[req.sessionId].user;

        db.find({ collection: 'users', query: { _id: new ObjectId(user) }, projection: { currentPassword: 1 } }).then(result => {
            if (!kerds.isnull(result)) {
                bcrypt.compare(data.currentPassword, result.currentPassword).then(valid => {
                    if (valid) {
                        bcrypt.hash(data.newPassword, 10).then(hash => {
                            data.newPassword = hash;
                            dataHandler.set({ collection: 'users', query: { _id: new ObjectId(user) }, options: { '$set': { currentPassword: data.newPassword } } }).then(changed => {
                                dataHandler.respond(req, res, { status: true, message: 'User password changed' });
                                dataHandler.makeHistory(req, true, { action: 'Change Password', data, collection: 'users', item: user });
                            });
                        });
                    }
                    else {
                        dataHandler.respond(req, res, { status: false, message: 'Current Passwords did not match, suggest logout' });
                    }
                });
            }
            else {
                dataHandler.respond(req, res, { status: false, message: 'User not found' });
            }
        });
    }

    return self;
}