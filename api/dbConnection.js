"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.insertOne = exports.getBody = exports.connectToDatabase = exports.getKeyForRole = exports.isValidKeyForRole = void 0;
const mongodb_1 = require("mongodb");
const http_status_codes_1 = require("http-status-codes");
const bcrypt = require("bcrypt");
const url = require('url');
const RANDOM_KEY = 'UAF7EeHWsF7cL73i4A3';
const expires = () => {
    const expiresDate = new Date();
    expiresDate.setHours(23, 59, 59, 0);
    return expiresDate.getTime();
};
exports.isValidKeyForRole = async (key, role) => await bcrypt.compare(expires() + role + RANDOM_KEY, key);
exports.getKeyForRole = async (role) => await bcrypt.hash(expires() + role + RANDOM_KEY, 10);
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
exports.getBody = async (method, rawBody) => {
    if (method !== 'POST' || !rawBody) {
        throw new Error('Method not allowed.');
    }
    let body;
    try {
        body = JSON.parse(rawBody);
    }
    catch (error) {
        throw new Error('Body is corrupted!');
    }
    return body;
};
exports.insertOne = async (collection, body) => {
    try {
        const db = await exports.connectToDatabase();
        const result = await db.collection(collection).insertOne(body);
        return {
            code: http_status_codes_1.default.CREATED,
            error: false,
            message: '',
            data: result
        };
    }
    catch (err) {
        return {
            code: http_status_codes_1.default.INTERNAL_SERVER_ERROR,
            error: true,
            message: err.message,
            data: []
        };
    }
};
exports.getAll = async (collection, find = {}) => {
    try {
        const db = await exports.connectToDatabase();
        const result = await db.collection(collection).find(find).toArray();
        return {
            code: http_status_codes_1.default.ACCEPTED,
            error: false,
            message: '',
            data: result
        };
    }
    catch (err) {
        return {
            code: http_status_codes_1.default.INTERNAL_SERVER_ERROR,
            error: true,
            message: err.message,
            data: []
        };
    }
};
