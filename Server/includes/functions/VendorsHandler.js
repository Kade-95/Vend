const DataHandler = require("./DataHandler");
let dataHandler = DataHandler();

module.exports = function VendorsHandler() {
    let self = {};

    self.favouriteVendor = (req, res, data) => {
        dataHandler.update({ collection: 'users', query: { _id: new ObjectId(data.vendor) }, options: { '$push': { favouredBy: global.sessions[id].user } } }).then(() => {
            dataHandler.update({ collection: 'users', query: { _id: new ObjectId(global.sessions[id].user) }, options: { '$push': { favourites: data.vendor } } }).then(() => {
                dataHandler.makeHistory({});
                dataHandler.respond(req, res, true);
            });
        });
    }

    self.unFavouriteVendor = (req, res, data) => {
        dataHandler.update({ collection: 'users', query: { _id: new ObjectId(data.vendor) }, options: { '$pull': { favouredBy: global.sessions[id].user } } }).then(() => {
            dataHandler.update({ collection: 'users', query: { _id: new ObjectId(global.sessions[id].user) }, options: { '$pull': { favourites: data.vendor } } }).then(() => {
                dataHandler.makeHistory({});
                dataHandler.respond(req, res, true);
            });
        });
    }

    self.getStarProgress = (req, res, data) => {

    }

    self.search = (req, res, data) => {
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
                dataHandler.respond(req, res, found);
                resolve(found);
            });
        });
    }  

    return self;
}