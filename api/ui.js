"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnection_1 = require("./dbConnection");
const get = async (request, response) => {
    const key = request.query.key;
    let json;
    if (!key) {
        return dbConnection_1.badRequest(response);
    }
    if (key === 'UI') {
        json = await dbConnection_1.getCollections('UI', {}, 'UI');
        response.status(json.code).json(json);
        return;
    }
    json = await dbConnection_1.getAll(key, {}, 'UI');
    response.status(json.code).json(json);
};
exports.default = async (request, response) => {
    if (request.method === 'GET') {
        return await get(request, response);
    }
    return dbConnection_1.badRequest(response);
};
