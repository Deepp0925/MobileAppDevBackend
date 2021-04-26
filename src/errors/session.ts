import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "../config";
import { Lang } from "../lang";
import { ISessionErrorInput } from "../types";
import { inject } from "../utils";
import { BaseError } from "./base";

export abstract class SessionError extends BaseError {
  // by default all session errors
  // have users logged out
  // this property is for indicating the frontend the user isn't authenicated (anymore)
  readonly isLoggedOut: boolean = true;
  constructor(data?: ISessionErrorInput) {
    super(data);
    this.isLoggedOut = !!data?.isLoggedOut;
  }
}

export class InvalidCredentialsError extends SessionError {
  constructor() {
    super({
      msg: Lang.translate("invalid_credentials_error"),
      statusCode: 400,
    });
  }
}

export class LoginError extends SessionError {
  constructor() {
    super({
      msg: Lang.translate("login_error"),
      statusCode: 500,
    });
  }
}

export class RegistrationError extends SessionError {
  constructor() {
    super({
      msg: Lang.translate("registration_error"),
      statusCode: 500,
    });
  }
}

export class EmailTakenError extends SessionError {
  constructor() {
    super({
      msg: Lang.translate("email_taken_error"),
      statusCode: 406,
    });
  }
}

export class AuthorizationError extends SessionError {
  constructor() {
    super({
      msg: Lang.translate("authorization_error"),
      statusCode: 401,
    });
  }
}

export class InvalidEmailError extends SessionError {
  constructor() {
    super({
      msg: Lang.translate("invalid_email_error"),
      statusCode: 406,
    });
  }
}

export class IncompleteFormError extends SessionError {
  constructor() {
    super({
      msg: Lang.translate("incomplete_form_error"),
      statusCode: 406,
    });
  }
}

export class ShortPasswordLengthError extends SessionError {
  constructor() {
    super({
      msg: inject(Lang.translate("password_too_short_error"), {
        minlength: PASSWORD_MIN_LENGTH,
      }),
      statusCode: 406,
    });
  }
}

export class LongPasswordLengthError extends SessionError {
  constructor() {
    super({
      msg: inject(Lang.translate("password_too_long_error"), {
        maxlength: PASSWORD_MAX_LENGTH,
      }),
      statusCode: 406,
    });
  }
}

export class InvalidTokenError extends SessionError {
  constructor() {
    super({
      msg: Lang.translate("invalid_token_error"),
      statusCode: 401,
    });
  }
}

export class IssueTokenError extends SessionError {
  constructor() {
    super({
      msg: Lang.translate("token_issue_error"),
      statusCode: 500,
    });
  }
}

export class NoSuchUserExistsError extends SessionError {
  constructor() {
    super({
      msg: Lang.translate("no_such_user_error"),
      statusCode: 404,
    });
  }
}
