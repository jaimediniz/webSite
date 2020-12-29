"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = void 0;
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
exports.connectToDatabase = connectToDatabase;
