"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const dbConnection_1 = require("./dbConnection");
exports.default = async (request, response) => {
    let body;
    try {
        body = await dbConnection_1.getBody(request.method, request.body);
    }
    catch (err) {
        return response
            .status(http_status_codes_1.default.BAD_REQUEST)
            .send({ error: true, message: err.message });
    }
    const result = await dbConnection_1.insertOne('Subscriptions', body);
    return response
        .status(result.code)
        .json({ error: result.error, message: result.message });
};
