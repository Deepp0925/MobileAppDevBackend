import { Lang } from "../lang";
import { BaseError } from "./base";

export class TopicTakenError extends BaseError {
  constructor() {
    super({
      msg: Lang.translate("topic_taken_error"),
      statusCode: 409,
    });
  }
}

export class InvalidTopicError extends BaseError {
  constructor() {
    super({
      msg: Lang.translate("invalid_topic_error"),
      statusCode: 406,
    });
  }
}
