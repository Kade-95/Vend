const DataHandler = require("./DataHandler");
let dataHandler = DataHandler();

function getFavouredBy(user) {

}

function getAdsRating(user) {

}

function getAdsRating(user) {

}

function getAdsRating(user) {

}

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
        let favoured = 100;
        let addFrequency = 33;
        let addPeriod = 40;
        let ratings = 50;
        let conversionRate = 65;
        let responseRate = 84;
        let uploadRate = 57;

        starLevel = (favoured + addFrequency + addPeriod + ratings + conversionRate + responseRate + uploadRate) / 7;

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