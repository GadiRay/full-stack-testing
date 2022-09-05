import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as Joi from 'joi';
import {
  ContainerTypes,
  // Use this as a replacement for express.Request
  ValidatedRequest,
  // Extend from this to define a valid schema type/interface
  ValidatedRequestSchema,
  // Creates a validator that generates middlewares
  createValidator,
} from 'express-joi-validation';

import pool from './db';
import { UsersService } from './usersService';

const app: Express = express();
const validator = createValidator();

const userParamsSchema = Joi.object({
  userId: Joi.number().required(),
});

const userBodySchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
});

interface UserRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    firstName: string;
    lastName: string;
    email: string;
  };
}
const port = 3001;

const usersService = new UsersService(pool);

app.use(cors());
app.use(bodyParser.json());

app.post(
  '/api/v1/users',
  validator.body(userBodySchema),
  async (
    req: ValidatedRequest<UserRequestSchema>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await usersService.addUser(req.body);
      return res.json(user);
    } catch (error) {
      return next(error);
    }
  }
);

app.get(
  '/api/v1/users/:userId',
  validator.params(userParamsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await usersService.getUser(req.params.userId);
      if (!user) {
        return res.status(404).send(`user ${req.params.userId} not found`);
      }
      return res.json(user);
    } catch (error) {
      return next(error);
    }
  }
);

app.listen(port, () => {
  console.log(`[my-server]: Server is running at https://localhost:${port}`);
});

export default app;
