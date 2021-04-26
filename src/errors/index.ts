import { Lang } from "../lang";
import { IInterpolateErrorInput } from "../types";
import { BaseError } from "./base";

export * from "./base";
export * from "./session";
export * from "./misc";
export * from "./topic";

/**
 *
 * @param err the instance of error to evalute if it is of BaseError
 * @param param1.msg custom message for the error - default is same as unknown_error
 * @param param1.statusCode custom status code for the error - default is 500
 * @param param1.error instance of BaseError. Will override msg and statusCode param - default is undefined
 * @returns an instance of BaseError
 */
export function interpolateError(
  err: Error,
  {
    msg = Lang.translate("unknown_error"),
    statusCode = 500,
    error = undefined,
  }: IInterpolateErrorInput = {}
) {
  if (err instanceof BaseError) return err;
  return error || new BaseError({ msg, statusCode });
}
