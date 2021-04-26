import { Lang } from "../lang";
import { BaseError } from "./base";

class _RateLimitError extends BaseError {
  constructor() {
    super({
      msg: Lang.translate("too_many_req_error"),
      statusCode: 429,
    });
  }
}

export const RateLimitError = new _RateLimitError();
