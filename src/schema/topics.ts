import {
  getModelForClass,
  modelOptions,
  prop,
  ReturnModelType,
} from "@typegoose/typegoose";
import { interpolateError, TopicTakenError } from "../errors";
import { IFetchAllReqParams, ITopicDocInput } from "../types";

@modelOptions({
  schemaOptions: {
    collection: "topics",
  },
})
export class TopicsSchema {
  // this is unique to prevent duplication of topics
  @prop({ required: true, unique: true })
  name!: string;

  constructor(doc: ITopicDocInput) {
    this.name = doc.name;
  }

  static async new(
    this: ReturnModelType<typeof TopicsSchema>,
    data: ITopicDocInput
  ) {
    try {
      // check if the topic alreay exists in the database
      let topic = await this.findOne({ name: data.name }).exec();
      // is already taken
      if (topic) throw new TopicTakenError();

      topic = await new TopicModel(data).save();
      return topic;
    } catch (error) {
      throw interpolateError(error);
    }
  }

  /**
   * fetches all topics in the database
   * @returns array of topic schemas
   */

  static async fetchAll(
    this: ReturnModelType<typeof TopicsSchema>,
    params: IFetchAllReqParams
  ) {
    try {
      return await this.find()
        .skip(params.skip || 0)
        .limit(20)
        .exec();
    } catch (error) {
      throw interpolateError(error);
    }
  }
}

export const TopicModel = getModelForClass(TopicsSchema);
