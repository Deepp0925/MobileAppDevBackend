import { Request, Response, NextFunction } from "express";
import {
  AuthorizationError,
  BaseError,
  IncompleteFormError,
  interpolateError,
  InvalidEmailError,
  LongPasswordLengthError,
  ShortPasswordLengthError,
} from "../errors";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "../config";
import validator from "validator";
import { isValidObjectId } from "mongoose";
import { Session } from "../utils";
isValidObjectId;

export class SessionValidators {
  static email(req: Request, res: Response, next: NextFunction) {
    if (!validator.isEmail(req.body.email)) {
      const error = new InvalidEmailError();
      res.status(error.statusCode).json(error.error);
      return;
    }
    next();
  }

  static password(req: Request, res: Response, next: NextFunction) {
    const pw = req.body.password;

    let error: BaseError;
    if (pw?.length < PASSWORD_MIN_LENGTH) {
      error = new ShortPasswordLengthError();
      res.status(error.statusCode).json(error.error);
      return;
    } else if (pw?.length > PASSWORD_MAX_LENGTH) {
      error = new LongPasswordLengthError();
      res.status(error.statusCode).json(error.error);
      return;
    }
    next();
  }

  static emptyRegistrationForm(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (
      !req.body.email ||
      !req.body.password ||
      !req.body.fullname ||
      validator.isEmpty(req.body?.email) ||
      validator.isEmpty(req.body?.password) ||
      validator.isEmpty(req.body?.fullname)
    ) {
      const error = new IncompleteFormError();
      res.status(error.statusCode).json(error.error);
      return;
    }
    next();
  }

  static isUserIDObjectID(req: Request, res: Response, next: NextFunction) {
    if (!req.params.id || !isValidObjectId(req.params.id)) {
      const error = new InvalidEmailError();
      res.status(error.statusCode).json(error.error);
      return;
    }
    next();
  }

  static async matchHeaderUserIDinBodyID(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.body.userId || !isValidObjectId(req.body.userId)) {
        const error = new InvalidEmailError();
        res.status(error.statusCode).json(error.error);
        return;
      }

      // it is valid id
      // check for a match in body
      if (
        (await Session.verifyToken(req.headers.authorization)).id !==
        req.body.userId
      ) {
        const error = new AuthorizationError();
        res.status(error.statusCode).json(error.error);
        return;
      }

      next();
    } catch (error) {
      const err = interpolateError(error);
      res.status(err.statusCode).json(err.error);
    }
  }

  static guardAdmin(req: Request, res: Response, next: NextFunction) {
    if (
      !req.body.adminPassword ||
      req.body.adminPassword !== process.env.ADMIN_PASSWORD
    ) {
      const error = new AuthorizationError();
      res.status(error.statusCode).json(error.error);
      return;
    }

    next();
  }
}
