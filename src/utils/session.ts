import { sign, Secret, SignOptions, verify, SignCallback } from "jsonwebtoken";
import { promisify } from "util";
import {
  interpolateError,
  InvalidTokenError,
  IssueTokenError,
} from "../errors";
import { Lang } from "../lang";
import { ITokenPayload } from "../types";
export class Session {
  // because this app does not have refresh token
  // tokens are only valid for 5 days
  static async issueToken(data: ITokenPayload) {
    try {
      // this returns string but typescript is not recognising
      // hence this workaround
      const token = ((await promisify<
        object,
        Secret,
        SignOptions,
        SignCallback
      >(sign)(data, process.env.JWT_SECRET!, {
        expiresIn: "5 days",
      })) as unknown) as string;

      if (!token) throw new IssueTokenError();

      return `Bearer ${token}`;
    } catch (error) {
      throw interpolateError(error, {
        error: new IssueTokenError(),
      });
    }
  }

  static async verifyToken(token?: string) {
    try {
      if (!token) throw new InvalidTokenError();

      // separates token from bearer
      // i.e. 'Bearer ...token' returns ...token
      const jwt = token.split(" ")[1];

      const data: unknown = await promisify<string, Secret>(verify)(
        jwt,
        process.env.JWT_SECRET!
      );

      if (!data) throw new InvalidTokenError();

      return (data as unknown) as ITokenPayload;
    } catch (error) {
      console.log(error);
      throw interpolateError(error, { error: new InvalidTokenError() });
    }
  }
}
