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

        let starLevel, star;

        if (starLevel > 90) {
            star = 'Patron';
        }
        else if (starLevel > 80) {
            star = 'Inferno';
        }
        else if (starLevel > 70) {
            star = 'Wild';
        }
        else if (starLevel > 60) {
            star = 'Virgo';
        }
        else if (starLevel > 50) {
            star = 'Blaze';
        }
        else if (starLevel > 40) {
            star = 'Flame';
        }
        else if (starLevel > 30) {
            star = 'Flare';
        }
        else if (starLevel > 20) {
            star = 'Ember';
        }
        else if (starLevel > 10) {
            star = 'Spark';
        }
        else if (starLevel < 10) {
            star = 'Fresh';
        }

        dataHandler.respond(req, res, star);
    }

    return self;
}