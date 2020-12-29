'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const http_status_codes_1 = require('http-status-codes');
const dbConnection_1 = require('./dbConnection');
exports.default = async (request, response) => {
  if (request.method !== 'GET') {
    return response.status(http_status_codes_1.default.BAD_REQUEST).send('');
  }
  const db = await dbConnection_1.connectToDatabase();
  const listings = await db
    .collection('Subscriptions')
    .find({})
    .sort({ metacritic: -1 })
    .limit(20)
    .toArray();
  return response.status(http_status_codes_1.default.ACCEPTED).json(listings);
};
