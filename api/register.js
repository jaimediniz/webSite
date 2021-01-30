"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const bcrypt = require("bcrypt");
const dbConnection_1 = require("./dbConnection");
exports.default = async (request, response) => {
    let body;
    try {
        body = JSON.parse(request.body);
    }
    catch (error) {
        return response
            .status(http_status_codes_1.default.BAD_REQUEST)
            .json({ error: true, message: 'Body is corrupted!' });
    }
    const payload = {
        username: body.username,
        password: await bcrypt.hash(body.password, 10)
    };
    const result = await dbConnection_1.insertOne('Users', payload);
    return response
        .status(result.code)
        .json({ error: result.error, message: result.message });
};
