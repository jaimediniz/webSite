"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const dbConnection_1 = require("./dbConnection");
exports.default = async (request, response) => {
    var _a, _b;
    if (request.method !== 'GET') {
        return response.status(http_status_codes_1.default.BAD_REQUEST).send('');
    }
    const db = await dbConnection_1.connectToDatabase((_b = (_a = process.env.MONGODB_URI) === null || _a === void 0 ? void 0 : _a.replace('{DB}', 'sample_airbnb')) !== null && _b !== void 0 ? _b : '');
    const listings = await db
        .collection('listingsAndReviews')
        .find({})
        .sort({ metacritic: -1 })
        .limit(20)
        .toArray();
    return response.status(http_status_codes_1.default.ACCEPTED).json(listings);
};
