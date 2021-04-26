import { ObjectId, Document } from "mongoose";
import { BaseError } from "./errors";
import { CoursesSchema } from "./schema/courses";
import { TopicsSchema } from "./schema/topics";

/////////////////////////////// Database Models ///////////////////////////////
export interface IUserDocInput extends IRegisterReq {}

export interface ICoursePointDocInput {
  course: Ref<CoursesSchema>;
  points?: number;
}

export interface ITopicDocInput {
  name: string;
}

export interface ICourseDocInput {
  name: string;
  topic: Ref<TopicsSchema>;
  questions: IQuestionsDocInput[];
}

export interface IQuestionsDocInput {
  question: string;
  img?: string;
  options: string[];
  answer: string;
}

/////////////////////////////// Session Interfaces ///////////////////////////////

// data that should be carried within the token itself
export interface ITokenPayload {
  id: ObjectId;
}

export interface IForgotPasswordReq {
  email: string;
}

export interface ILoginReq extends IForgotPasswordReq {
  password: string;
}

export interface IRegisterReq extends ILoginReq {
  fullname: string;
}

export interface ISessionRes {
  /// the user id
  id: ObjectId;
  /// token
  token: string;
}

/////////////////////////////// error interfaces ///////////////////////////////
export interface IBaseErrorInput {
  msg?: string;
  statusCode?: number;
}

export interface IInterpolateErrorInput extends IBaseErrorInput {
  error?: BaseError;
}

export interface IBaseErrorOutput
  extends Required<Pick<IBaseErrorInput, "statusCode">> {
  message: string;
  error: true;
}

export interface ISessionErrorInput extends IBaseErrorInput {
  isLoggedOut?: boolean;
}

export interface ISessionErrorOutput
  extends Required<ISessionErrorInput>,
    IBaseErrorOutput {}

//////////////////////////////// Response Interface ////////////////////////////////
export interface IBaseResponseInput<T> {
  data: T;
}

//////////////////////////////// Additional Interfaces ////////////////////////////////
export interface IUpdateCoursePointsReq {
  course: Ref<CoursesSchema>;
  points: number;
}

export interface IForgotPasswordEmailInput extends IForgotPasswordReq {
  password: string;
}

export interface IFetchAccountBasicInfoReq {
  userId: string;
}

// this will appear in the URL
export interface IFetchAllReqParams {
  skip: number;
}

export interface IFetchCoursesReq extends IFetchAllReqParams {
  topicId: Ref<TopicsSchema>;
}
