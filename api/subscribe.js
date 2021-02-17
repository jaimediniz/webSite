"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const dbConnection_1 = require("./dbConnection");
const post = async (request) => {
    const body = await dbConnection_1.getBody(request.method, request.body);
    return await dbConnection_1.insertOne('Subscriptions', body);
};
exports.default = async (request, response) => {
    let json;
    try {
        let result;
        if (request.method === 'POST') {
            result = await post(request);
        }
        else {
            result = {
                code: http_status_codes_1.default.BAD_REQUEST,
                error: true,
                message: 'Bad Request',
                data: {}
            };
        }
        json = {
            code: result.code,
            error: result.error,
            message: result.message,
            data: {}
        };
        return response.status(result.code).json(json);
    }
    catch (err) {
        json = {
            code: http_status_codes_1.default.INTERNAL_SERVER_ERROR,
            error: true,
            message: err.message,
            data: {}
        };
        return response.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json(json);
    }
};
