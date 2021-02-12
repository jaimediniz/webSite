"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const bcrypt = require("bcrypt");
const dbConnection_1 = require("./dbConnection");
exports.default = async (request, response) => {
    let body;
    try {
        body = await dbConnection_1.getBody(request.method, request.body);
    }
    catch (err) {
        return response
            .status(http_status_codes_1.default.BAD_REQUEST)
            .send({ error: true, message: err.message });
    }
    console.log(body);
    const db = await dbConnection_1.connectToDatabase();
    const users = (await db
        .collection('Users')
        .find({ username: body.username })
        .toArray());
    if (users.length !== 1 ||
        !(await bcrypt.compare(body.password, users[0].password))) {
        return response.status(http_status_codes_1.default.BAD_REQUEST).json({
            error: true,
            message: 'You have entered an invalid username or password!'
        });
    }
    console.log(users[0]);
    return response
        .status(http_status_codes_1.default.ACCEPTED)
        .json({ username: users[0].username, role: users[0].role });
};
