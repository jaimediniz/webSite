"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const dbConnection_1 = require("./dbConnection");
exports.default = async (request, response) => {
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
        const db = await dbConnection_1.connectToDatabase();
        const result = await db.collection('Subscriptions').insertOne(body);
        console.log(result);
        return response
            .status(http_status_codes_1.default.CREATED)
            .json({ error: false, message: result });
    }
    catch (err) {
        console.log(err);
        return response
            .status(http_status_codes_1.default.INTERNAL_SERVER_ERROR)
            .json({ error: true, message: err.message });
    }
};
