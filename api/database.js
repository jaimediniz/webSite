"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const url = require('url');
let cachedDb;
async function connectToDatabase(uri) {
    if (cachedDb) {
        return cachedDb;
    }
    const client = await mongodb_1.MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const db = await client.db(url.parse(uri).pathname.substr(1));
    cachedDb = db;
    return db;
}
exports.default = async (request, response) => {
    var _a;
    const db = await connectToDatabase((_a = process.env.MONGODB_URI) !== null && _a !== void 0 ? _a : '');
    const listings = await db
        .collection('listingsAndReviews')
        .find({})
        .sort({ metacritic: -1 })
        .limit(20)
        .toArray();
    return response.status(200).json(listings);
};
