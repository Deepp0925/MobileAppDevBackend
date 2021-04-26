import { prop } from "@typegoose/typegoose";
import { IQuestionsDocInput } from "../types";

export class QuestionsSchema {
  @prop({ required: true })
  question!: string;

  @prop({ required: true, type: () => [String] })
  options!: string[];

  @prop()
  img?: string;

  @prop({ required: true })
  answer!: string;

  get has_img() {
    return !!this.img;
  }

  constructor(doc: IQuestionsDocInput) {
    this.question = doc.question;
    this.options = doc.options;
    this.img = doc.img;
    this.answer = doc.answer;
  }
}
