"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const dbConnection_1 = require("./dbConnection");
const get = async (request) => {
    var _a, _b;
    if (!(await dbConnection_1.isValidKeyForRole((_b = (_a = request === null || request === void 0 ? void 0 : request.headers) === null || _a === void 0 ? void 0 : _a.authorization) !== null && _b !== void 0 ? _b : '', 'admin'))) {
        return {
            code: http_status_codes_1.default.BAD_REQUEST,
            error: true,
            message: 'Access denied.',
            data: []
        };
    }
    return await dbConnection_1.getAll('Users');
};
exports.default = async (request, response) => {
    let json;
    try {
        let result;
        if (request.method === 'GET') {
            result = await get(request);
        }
        else {
            result = {
                code: http_status_codes_1.default.BAD_REQUEST,
                error: true,
                message: 'Bad Request',
                data: {}
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
            data: {}
        };
        return response.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json(json);
    }
};
