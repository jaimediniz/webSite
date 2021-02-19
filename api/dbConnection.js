"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.badRequest = exports.getAll = exports.deleteOne = exports.insertOne = exports.getBody = exports.connectToDatabase = exports.login = exports.getKeyForRole = exports.isUserAllowed = void 0;
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
exports.isUserAllowed = async (request, role) => {
    var _a, _b;
    return await bcrypt.compare(expires() + role + RANDOM_KEY, (_b = (_a = request === null || request === void 0 ? void 0 : request.headers) === null || _a === void 0 ? void 0 : _a.authorization) !== null && _b !== void 0 ? _b : '');
};
exports.getKeyForRole = async (role) => await bcrypt.hash(expires() + role + RANDOM_KEY, 10);
exports.login = async (role) => {
    const key = exports.getKeyForRole(role);
    return {
        code: http_status_codes_1.default.ACCEPTED,
        error: false,
        message: 'Logged',
        data: { role, key }
    };
};
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
exports.getBody = async (rawBody) => {
    let body;
    try {
        body = JSON.parse(rawBody);
    }
    catch (error) {
        throw new Error(JSON.stringify({
            error: {
                code: 400,
                error: true,
                message: 'Body is corrupted!',
                data: {}
            }
        }));
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
exports.deleteOne = async (collection, find) => {
    try {
        const db = await exports.connectToDatabase();
        const result = await db.collection(collection).deleteOne(find);
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
exports.badRequest = (response, data = {}) => {
    const error = {
        code: http_status_codes_1.default.BAD_REQUEST,
        error: true,
        message: 'Bad Request',
        data
    };
    response.status(error.code).json(error);
};
