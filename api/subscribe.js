"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const dbConnection_1 = require("./dbConnection");
const post = async (request) => {
    const body = await dbConnection_1.getBody(request.method, request.body);
    return await dbConnection_1.insertOne('Subscriptions', body);
};
exports.default = async (request, response) => {
    try {
        let result;
        if (request.method === 'POST') {
            result = await post(request);
        }
        if (result) {
            return response
                .status(result.code)
                .json({ error: result.error, message: result.message });
        }
        return response
            .status(http_status_codes_1.default.BAD_REQUEST)
            .json({ error: true, message: 'Bad Request' });
    }
    catch (err) {
        return response
            .status(http_status_codes_1.default.INTERNAL_SERVER_ERROR)
            .json({ error: true, message: err.message });
    }
};
