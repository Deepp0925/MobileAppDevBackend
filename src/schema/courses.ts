import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
  ReturnModelType,
} from "@typegoose/typegoose";
import { isValidObjectId } from "mongoose";
import { MAX_QUESTION_PER_COURSE, MIN_QUESTION_PER_COURSE } from "../config";
import { interpolateError, InvalidTopicError } from "../errors";
import {
  NoCourseNameError,
  MinNumCourseQuestionError,
  MaxNumCourseQuestionError,
} from "../errors/course";
import { ICourseDocInput, IFetchCoursesReq } from "../types";
import { QuestionsSchema } from "./questions";
import { TopicsSchema } from "./topics";

@modelOptions({
  schemaOptions: {
    collection: "courses",
  },
})
export class CoursesSchema {
  @prop({ required: true })
  name!: string;

  @prop({ ref: () => TopicsSchema })
  topic!: Ref<TopicsSchema>;

  @prop({ type: () => QuestionsSchema })
  public questions?: QuestionsSchema[];

  constructor(doc: ICourseDocInput) {
    this.topic = doc.topic;
    this.name = doc.name;
    this.questions = doc.questions.map(
      (question) => new QuestionsSchema(question)
    );
  }

  static async new(
    this: ReturnModelType<typeof CoursesSchema>,
    data: ICourseDocInput
  ) {
    try {
      // check if the course is a valid object id
      if (!isValidObjectId(data.topic)) throw new InvalidTopicError();
      // not enough of questions
      if (
        !data.questions.length ||
        data.questions.length < MIN_QUESTION_PER_COURSE
      )
        throw new MinNumCourseQuestionError();

      // exceeded max num of questions
      if (data.questions.length > MAX_QUESTION_PER_COURSE)
        throw new MaxNumCourseQuestionError();

      // provide a course name
      if (!data.name) throw new NoCourseNameError();

      return await new CoursesModel(data).save();
    } catch (error) {
      throw interpolateError(error);
    }
  }

  /**
   * fetches all courses in the database
   * @returns array of course schemas
   */

  static async fetchCourses(
    this: ReturnModelType<typeof CoursesSchema>,
    data: IFetchCoursesReq
  ) {
    try {
      return await this.find({ topic: data.topicId })
        .skip(data.skip || 0)
        .limit(20)
        .exec();
    } catch (error) {
      throw interpolateError(error);
    }
  }
}

export const CoursesModel = getModelForClass(CoursesSchema);
