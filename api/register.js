"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const dbConnection_1 = require("./dbConnection");
const roles = {
    6955037335: 'admin',
    3901821888: 'user',
    5365032369: 'mod'
};
const post = async (request, response) => {
    const body = await dbConnection_1.getBody(request.body);
    if (!body) {
        return dbConnection_1.badRequest(response);
    }
    const role = roles[body.code];
    if (!role) {
        return dbConnection_1.badRequest(response);
    }
    const payload = {
        username: body.username,
        password: await bcrypt.hash(body.password, 10),
        role
    };
    const json = await dbConnection_1.insertOne('Users', payload);
    response.status(json.code).json(json);
};
exports.default = async (request, response) => {
    if (request.method === 'POST') {
        return await post(request, response);
    }
    return dbConnection_1.badRequest(response);
};
