"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const bcrypt = require("bcrypt");
const dbConnection_1 = require("./dbConnection");
const post = async (request) => {
    const body = await dbConnection_1.getBody(request.method, request.body);
    const users = (await dbConnection_1.getAll('Users', {
        username: body.username
    })).data;
    if (users.length < 1 ||
        !(await bcrypt.compare(body.password, users[0].password))) {
        return {
            code: http_status_codes_1.default.BAD_REQUEST,
            error: true,
            message: 'You have entered an invalid username or password!',
            data: { role: 'user', key: '' }
        };
    }
    const key = await dbConnection_1.getKeyForRole(users[0].role);
    return {
        code: http_status_codes_1.default.ACCEPTED,
        error: false,
        message: 'Success',
        data: { role: users[0].role, key }
    };
};
exports.default = async (request, response) => {
    let json;
    try {
        let result;
        if (request.method === 'POST') {
            result = await post(request);
        }
        else {
            result = {
                code: http_status_codes_1.default.BAD_REQUEST,
                error: true,
                message: 'Bad Request',
                data: { role: '', key: '' }
            };
        }
        json = {
            code: result.code,
            error: result.error,
            message: result.message,
            data: result.data
        };
        return response.status(result.code).json(json);
    }
    catch (err) {
        json = {
            code: http_status_codes_1.default.INTERNAL_SERVER_ERROR,
            error: true,
            message: err.message,
            data: { role: '', key: '' }
        };
        return response.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json(json);
    }
};
