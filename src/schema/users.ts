import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";

import {
  BaseError,
  EmailTakenError,
  interpolateError,
  InvalidCredentialsError,
  InvalidEmailError,
  LoginError,
  NoSuchUserExistsError,
} from "../errors";

import {
  IFetchAccountBasicInfoReq,
  IForgotPasswordReq,
  ILoginReq,
  IRegisterReq,
  IUpdateCoursePointsReq,
  IUserDocInput,
  // IUsersDBModel,
} from "../types";
import { Session } from "../utils";
import { CoursePointsSchema } from "./coursePoints";
import { compare, genSalt, hash } from "bcrypt";
import { CoursePointUpdateError } from "../errors/course";
import { randomBytes } from "crypto";
import validator from "validator";
import { isValidObjectId } from "mongoose";

@modelOptions({
  schemaOptions: {
    timestamps: { createdAt: true, updatedAt: true },
    collection: "users",
  },
})
class UserSchema {
  @prop({ required: true, unique: true, trim: true })
  email!: string;

  @prop({ required: true, trim: true })
  password!: string;

  @prop({ required: true, trim: true })
  fullname!: string;

  @prop({ type: () => CoursePointsSchema })
  courses!: CoursePointsSchema[];

  constructor(doc: IUserDocInput) {
    this.email = doc.email;
    this.password = doc.password;
    this.fullname = doc.fullname;
  }

  /*
   * adds up all the points from the courses
   */
  get points() {
    return this.courses
      .map((course) => course.points)
      .reduce((a, b) => a + b, 0);
  }

  get info() {
    return {
      id: (this as any)._id,
      email: this.email,
      fullname: this.fullname,
      courses: this.courses,
      points: this.points,
    };
  }

  async updatePoints(
    this: DocumentType<UserSchema>,
    details: IUpdateCoursePointsReq
  ) {
    try {
      // does base check of validity
      if (typeof details.points !== "number") throw new BaseError();
      if (!isValidObjectId(details.course)) throw new BaseError();

      const courseIndex = this.courses.findIndex(
        (course) => course.course == details.course
      );

      console.log(courseIndex, this.courses);

      // user has taken this course for the first time
      if (courseIndex < 0) {
        this.courses.push(
          new CoursePointsSchema({
            course: details.course,
            points: details.points,
          })
        );
      } else {
        // course is taken by the user before and scored same or higher previous time
        if (this.courses[courseIndex].points >= details.points)
          return this.courses[courseIndex];
        else {
          this.courses[courseIndex].points = details.points;
        }
      }

      await this.save();
      // newly inserted document
      if (courseIndex < 0) {
        return this.courses[this.courses.length - 1];
      }
      return this.courses[courseIndex];
    } catch (error) {
      console.log(error);
      throw interpolateError(error, { error: new CoursePointUpdateError() });
    }
  }

  /**
   *
   * @param data object that has userId requirement
   * @returns user.info
   */
  static async fetchAcct(
    this: ReturnModelType<typeof UserSchema>,
    data: IFetchAccountBasicInfoReq
  ) {
    try {
      // check if user exists
      const user = await this.findById({ _id: data.userId }).exec();

      if (!user) throw new NoSuchUserExistsError();

      return user.info;
    } catch (error) {
      throw interpolateError(error);
    }
  }

  /**
   *
   * @param data information required to complete registeration all fields are required
   * @returns
   */
  static async register(
    this: ReturnModelType<typeof UserSchema>,
    data: IRegisterReq
  ) {
    try {
      // check if the email already in database
      const user = await this.findOne({ email: data.email }).exec();
      // user taken
      if (user) throw new EmailTakenError();

      const saltedPassword = await this._saltPassword(data.password);

      // an error while salting password
      if (!saltedPassword) throw new LoginError();

      // reassigning
      data.password = saltedPassword;

      const newUser = await new UserModel(data).save();

      const token = await Session.issueToken({ id: newUser._id });

      // because this is new user
      // there should be no courses and points on the account
      return { ...newUser.info, token, courses: [], points: 0 };
    } catch (error) {
      throw interpolateError(error);
    }
  }

  //TODO update this method
  static async changePassword() {
    try {
    } catch (error) {}
  }

  /**
   *
   * @param data contains the email of the lost user
   * @returns true if all operations complete successfully, throws error otherwise
   */
  static async forgotPassword(
    this: ReturnModelType<typeof UserSchema>,
    data: IForgotPasswordReq
  ) {
    try {
      // check if the email already in database
      const user = await this.findOne({ email: data.email }).exec();
      // no user exists
      if (!user) throw new InvalidEmailError();

      const newPassword = randomBytes(8).toString("hex");
      const saltedPassword = await this._saltPassword(newPassword);

      // throwing empty string because catch will convert it into BaseError
      if (!saltedPassword) throw "";

      // TODO implement sending email
      //send email

      user.password = newPassword;
      await user.save();
      return true;
    } catch (error) {
      throw interpolateError(error);
    }
  }

  private static async _saltPassword(password: string) {
    try {
      return await hash(password, await genSalt());
    } catch (error) {
      return false;
    }
  }

  static async login(
    this: ReturnModelType<typeof UserSchema>,
    data: ILoginReq
  ) {
    try {
      const user = await this.findOne({ email: data.email });

      // no such user exists
      if (!user) throw new InvalidCredentialsError();

      const isMatch = await compare(data.password, user.password);

      // password does not match
      if (!isMatch) throw new InvalidCredentialsError();

      const token = await Session.issueToken({ id: user._id });

      return { ...user.info, token };
    } catch (error) {
      throw interpolateError(error);
    }
  }
}

export const UserModel = getModelForClass(UserSchema);
