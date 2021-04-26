import { Lang } from "../lang";
import { BaseError } from "./base";

export class MailError extends BaseError {
  constructor() {
    super({
      msg: Lang.translate("mail_error"),
    });
  }
}
