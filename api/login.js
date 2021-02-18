"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const dbConnection_1 = require("./dbConnection");
const post = async (request, response) => {
    const body = await dbConnection_1.getBody(request.body);
    if (!body) {
        return dbConnection_1.badRequest(response, { role: '', key: '' });
    }
    const user = (await dbConnection_1.getAll('Users', {
        username: body.username
    })).data[0];
    if (!user || !(await bcrypt.compare(body.password, user.password))) {
        return dbConnection_1.badRequest(response, { role: '', key: '' });
    }
    const json = await dbConnection_1.login(user.role);
    response.status(json.code).json(json);
};
exports.default = async (request, response) => {
    if (request.method === 'POST') {
        return await post(request, response);
    }
    return dbConnection_1.badRequest(response);
};
