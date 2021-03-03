"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnection_1 = require("./dbConnection");
const get = async (request, response) => {
    const key = request.query.key;
    if (!key) {
        return dbConnection_1.badRequest(response);
    }
    const json = await dbConnection_1.getAll('External', {
        key
    });
    response.status(json.code).json(json);
};
exports.default = async (request, response) => {
    if (request.method === 'GET') {
        return await get(request, response);
    }
    return dbConnection_1.badRequest(response);
};
