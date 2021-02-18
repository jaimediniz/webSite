"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnection_1 = require("./dbConnection");
const post = async (request, response) => {
    const body = await dbConnection_1.getBody(request.body);
    if (!body) {
        return dbConnection_1.badRequest(response);
    }
    const json = await dbConnection_1.insertOne('Subscriptions', body);
    response.status(json.code).json(json);
};
exports.default = async (request, response) => {
    if (request.method === 'POST') {
        return await post(request, response);
    }
    return dbConnection_1.badRequest(response);
};
