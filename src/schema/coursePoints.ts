import { prop, modelOptions, index, Ref } from "@typegoose/typegoose";
import { ICoursePointDocInput } from "../types";
import { CoursesSchema } from "./courses";

@index({ _id: 0 })
@modelOptions({
  schemaOptions: {
    timestamps: false,
    _id: false,
    id: false,
  },
})
export class CoursePointsSchema {
  @prop({ required: true, ref: () => CoursesSchema })
  course!: Ref<CoursesSchema>;

  @prop({ required: true, default: 0 })
  points!: number;

  constructor(doc: ICoursePointDocInput) {
    this.course = doc.course;
    this.points = doc.points || 0;
  }
}
