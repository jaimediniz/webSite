"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("../../util/mongodb");
exports.default = async (request, response) => {
    const { db } = await mongodb_1.connectToDatabase();
    const movies = await db
        .collection('movies')
        .find({})
        .sort({ metacritic: -1 })
        .limit(20)
        .toArray();
    response.json(movies);
};
