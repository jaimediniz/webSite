"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnection_1 = require("./dbConnection");
const get = async (request, response) => {
    const json = await dbConnection_1.getAll('Events');
    response.status(json.code).json(json);
};
const post = async (request, response) => {
    const body = await dbConnection_1.getBody(request.method, request.body);
    if (!body) {
        return dbConnection_1.badRequest(response);
    }
    const json = await dbConnection_1.insertOne('Events', body);
    response.status(json.code).json(json);
};
exports.default = async (request, response) => {
    if (request.method === 'GET') {
        return await get(request, response);
    }
    if (request.method === 'POST') {
        return await post(request, response);
    }
    return dbConnection_1.badRequest(response);
};
