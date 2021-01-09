"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = void 0;
const mongodb_1 = require("mongodb");
const url = require('url');
let cachedDb;
exports.connectToDatabase = async () => {
    var _a;
    if (cachedDb) {
        return cachedDb;
    }
    const uri = (_a = process.env.MONGODB_URI) !== null && _a !== void 0 ? _a : '';
    const client = await mongodb_1.MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const db = await client.db(url.parse(uri).pathname.substr(1));
    cachedDb = db;
    return db;
};
