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
                dataHandler.respond(req, res, { status: true, message: 'Vendor has been added to favourites'});
            });
        });
    }

    self.unFavouriteVendor = (req, res, data) => {
        dataHandler.update({ collection: 'users', query: { _id: new ObjectId(data.vendor) }, options: { '$pull': { favouredBy: global.sessions[id].user } } }).then(() => {
            dataHandler.update({ collection: 'users', query: { _id: new ObjectId(global.sessions[id].user) }, options: { '$pull': { favourites: data.vendor } } }).then(() => {
                dataHandler.makeHistory({});
                dataHandler.respond(req, res, {status: true, message: 'Vendor has been removed from Favourites'});
            });
        });
    }

    return self;
}