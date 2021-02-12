"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnection_1 = require("./dbConnection");
exports.default = async (request, response) => {
    let body;
    let result;
    try {
        body = await dbConnection_1.getBody(request.method, request.body);
        result = await dbConnection_1.insertOne('Events', body);
    }
    catch (err) {
        result = await dbConnection_1.getAll('Events');
    }
    return response
        .status(result.code)
        .json({ error: result.error, message: result.message });
};
