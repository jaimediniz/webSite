"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const dbConnection_1 = require("./dbConnection");
exports.default = async (request, response) => {
    const isAllowed = await dbConnection_1.isUserAllowed(request, 'admin');
    if (!isAllowed) {
        return dbConnection_1.badRequest(response);
    }
    if (request.method === 'GET') {
        return await get(request, response);
    }
    if (request.method === 'POST') {
        return await post(request, response);
    }
    if (request.method === 'PUT') {
        return await put(request, response);
    }
    if (request.method === 'DELETE') {
        return await del(request, response);
    }
    return dbConnection_1.badRequest(response);
};
const get = async (request, response) => {
    const collection = request.query.collection;
    let json;
    if (!collection) {
        return dbConnection_1.badRequest(response);
    }
    if (collection === 'UI') {
        json = await dbConnection_1.getCollections(collection, {}, 'UI');
        response.status(json.code).json(json);
    }
    json = await dbConnection_1.getAll(collection);
    response.status(json.code).json(json);
};
const post = async (request, response) => {
    const body = await dbConnection_1.getBody(request.body);
    if (!body) {
        return dbConnection_1.badRequest(response);
    }
    const collection = request.query.collection;
    if (!collection) {
        return dbConnection_1.badRequest(response);
    }
    const json = await dbConnection_1.insertOne(collection, body);
    response.status(json.code).json(json);
    return;
};
const put = async (request, response) => {
    const body = await dbConnection_1.getBody(request.body);
    if (!body) {
        return dbConnection_1.badRequest(response);
    }
    const collection = request.query.collection;
    const id = request.query.id;
    if (!collection || !id) {
        return dbConnection_1.badRequest(response);
    }
    const json = await dbConnection_1.updateOne(collection, {
        _id: new mongodb_1.ObjectID(id)
    }, body);
    response.status(json.code).json(json);
    return;
};
const del = async (request, response) => {
    const collection = request.query.collection;
    const id = request.query.id;
    if (!collection || !id) {
        return dbConnection_1.badRequest(response);
    }
    const json = await dbConnection_1.deleteOne(collection, {
        _id: new mongodb_1.ObjectID(id)
    });
    response.status(json.code).json(json);
    return;
};
