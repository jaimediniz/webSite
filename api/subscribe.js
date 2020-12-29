"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const dbConnection_1 = require("./dbConnection");
exports.default = async (request, response) => {
    var _a, _b;
    if (request.method !== 'POST' || !request.body) {
        return response
            .status(http_status_codes_1.default.BAD_REQUEST)
            .send({ error: true, message: 'Method not allowed.' });
    }
    let body;
    try {
        body = JSON.parse(request.body);
        console.log(body);
    }
    catch (error) {
        return response
            .status(http_status_codes_1.default.BAD_REQUEST)
            .json({ error: true, message: 'Body is corrupted!' });
    }
    try {
        const db = await dbConnection_1.connectToDatabase((_b = (_a = process.env.MONGODB_URI) === null || _a === void 0 ? void 0 : _a.replace('{DB}', 'Tandem')) !== null && _b !== void 0 ? _b : '');
        await db.collection('Subscriptions').insertOne(body);
    }
    catch (err) {
        console.log(err);
        return response
            .status(http_status_codes_1.default.INTERNAL_SERVER_ERROR)
            .json({ error: true, message: err.message });
    }
    return response
        .status(http_status_codes_1.default.CREATED)
        .json({ error: false, message: 'Created!' });
};
