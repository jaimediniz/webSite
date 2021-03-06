"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnection_1 = require("./dbConnection");
const get = async (response) => {
    const json = await dbConnection_1.getAll('Events');
    response.status(json.code).json(json);
};
exports.default = async (request, response) => {
    if (request.method === 'GET') {
        return await get(response);
    }
    return dbConnection_1.badRequest(response);
};
