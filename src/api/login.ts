import { Request, Response } from 'express';
import Status from 'http-status-codes';
import * as bcrypt from 'bcrypt';

import { connectToDatabase, getBody } from './dbConnection';

interface UserEntry {
  _id: string;
  username: string;
  password: string;
  role: string;
}

export default async (request: Request, response: Response) => {
  let body;
  try {
    body = await getBody(request.method, request.body);
  } catch (err) {
    return response
      .status(Status.BAD_REQUEST)
      .send({ error: true, message: err.message });
  }
  console.log(body);

  const db = await connectToDatabase();
  /* cSpell:disable */
  const users: Array<UserEntry> = (await db
    .collection('Users')
    .find({ username: body.username })
    .toArray()) as any;
  /* cSpell:enable */

  if (
    users.length !== 1 ||
    !(await bcrypt.compare(body.password, users[0].password))
  ) {
    return response.status(Status.BAD_REQUEST).json({
      error: true,
      message: 'You have entered an invalid username or password!'
    });
  }
  console.log(users[0]);

  return response
    .status(Status.ACCEPTED)
    .json({ username: users[0].username, role: users[0].role });
};
