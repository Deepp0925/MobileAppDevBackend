import { promisify } from "util";
import {
  createTestAccount,
  createTransport,
  TestAccount,
  getTestMessageUrl,
} from "nodemailer";
import { interpolateError, MailError } from "../errors";
import { IForgotPasswordEmailInput } from "../types";
import { Lang } from "../lang";
import { inject } from "./string";

export class Mail {
  static async forgotPasswordEmail(details: IForgotPasswordEmailInput) {
    try {
      //   const account = (await promisify(createTestAccount)()) as TestAccount;

      const transporter = createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: "edison91@ethereal.email",
          pass: "sZSk6EpT2Qn9BHmu6V",
        },
      });

      const mailInfo = await transporter.sendMail({
        from: "Support <support@noreply.com>",
        to: details.email,
        subject: Lang.translate("forgot_password_mail_title"),
        // injects the password
        text: inject(Lang.translate("forgot_password_mail_body"), {
          password: details.password,
        }),
      });

      console.log(getTestMessageUrl(mailInfo));

      return true;
    } catch (error) {
      throw interpolateError(error, { error: new MailError() });
    }
  }
}
