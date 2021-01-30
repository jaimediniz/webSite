"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const bcrypt = require("bcrypt");
const dbConnection_1 = require("./dbConnection");
const roles = {
    6955037335: 'admin',
    3901821888: 'user',
    5365032369: 'mod'
};
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
    const role = roles[body.code];
    console.log(role);
    if (!role) {
        return response
            .status(http_status_codes_1.default.BAD_REQUEST)
            .json({ error: true, message: 'Body is corrupted!' });
    }
    const payload = {
        username: body.username,
        password: await bcrypt.hash(body.password, 10),
        role
    };
    const result = await dbConnection_1.insertOne('Users', payload);
    return response
        .status(result.code)
        .json({ error: result.error, message: result.message });
};
