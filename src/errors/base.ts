import { Lang } from "../lang";
import { IBaseErrorInput, IBaseErrorOutput } from "../types";

const DEFAULT_ERR_MSG = Lang.translate("unknown_error");
const DEFAULT_STATUS_CODE = 500;
// list of properties to be excluded from final data set
// that will be sent to the user
// i.e. stack property is useless to client, so no need to send it
const EXCLUDE_ERROR_PROPS = ["stack", "name", "error"] as const;

export class BaseError extends Error {
  // status code to send
  // by default all error are caused by internal error(500)
  readonly statusCode: number;

  constructor({
    msg = DEFAULT_ERR_MSG,
    statusCode = DEFAULT_STATUS_CODE,
  }: IBaseErrorInput = {}) {
    super(msg);
    this.statusCode = statusCode;
  }

  /**
   * returns only a select few properties current error
   * and returns them in form of object
   * error property won't show up in intellisense because
   * that will always be true for all errors
   */
  get error(): Omit<this, typeof EXCLUDE_ERROR_PROPS[number]> {
    const keys = Object.getOwnPropertyNames(this).filter(
      (val) => !EXCLUDE_ERROR_PROPS.includes(val as any)
    );

    const data: any = {
      error: true,
    };

    for (const key of keys) {
      data[key] = Object.getOwnPropertyDescriptor(this, key)?.value;
    }

    return data;
  }
}
