"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const http_status_codes_1 = require("http-status-codes");
exports.default = async (request, response) => {
    var _a;
    if (request.method !== 'POST') {
        return response.status(http_status_codes_1.default.BAD_REQUEST).send('');
    }
    if (!request.body) {
        return response.status(http_status_codes_1.default.BAD_REQUEST).send('');
    }
    const resp = await node_fetch_1.default((_a = process.env.MONGODB_URI) !== null && _a !== void 0 ? _a : '', {
        method: 'post',
        body: request.body
    });
    console.log(resp);
    return response.send({
        statusCode: 201,
        body: '{"code":201,"error":false,"message":"???!"}'
    });
};
