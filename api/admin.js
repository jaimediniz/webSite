"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bson_1 = require("bson");
const dbConnection_1 = require("./dbConnection");
const get = async (request, response) => {
    const collection = request.query.collection;
    if (!collection) {
        return dbConnection_1.badRequest(response);
    }
    const json = await dbConnection_1.getAll(collection);
    response.status(json.code).json(json);
};
const post = async (request, response) => {
    const body = await dbConnection_1.getBody(request.body);
    if (!body) {
        return dbConnection_1.badRequest(response);
    }
    const collection = request.query.collection;
    const action = request.query.action;
    if (!collection || !action) {
        return dbConnection_1.badRequest(response);
    }
    if (action === 'insert') {
        const json = await dbConnection_1.insertOne(collection, body);
        response.status(json.code).json(json);
        return;
    }
    if (action === 'delete') {
        const json = await dbConnection_1.deleteOne(collection, {
            _id: new bson_1.ObjectId(body._id)
        });
        response.status(json.code).json(json);
        return;
    }
    return dbConnection_1.badRequest(response);
};
exports.default = async (request, response) => {
    if (!dbConnection_1.isUserAllowed(request, 'admin')) {
        return dbConnection_1.badRequest(response);
    }
    if (request.method === 'GET') {
        return await get(request, response);
    }
    if (request.method === 'POST') {
        return await post(request, response);
    }
    return dbConnection_1.badRequest(response);
};
