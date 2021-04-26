import { MAX_QUESTION_PER_COURSE, MIN_QUESTION_PER_COURSE } from "../config";
import { Lang } from "../lang";
import { IBaseErrorInput } from "../types";
import { inject } from "../utils";
import { BaseError } from "./base";

export abstract class CourseError extends BaseError {
  constructor(data: IBaseErrorInput) {
    super(data);
  }
}

export class CoursePointUpdateError extends CourseError {
  constructor() {
    super({
      msg: Lang.translate("course_points_update_error"),
    });
  }
}

export class MinNumCourseQuestionError extends BaseError {
  constructor() {
    super({
      msg: inject(Lang.translate("min_num_questions_error"), {
        min_questions: MIN_QUESTION_PER_COURSE,
      }),
    });
  }
}

export class MaxNumCourseQuestionError extends BaseError {
  constructor() {
    super({
      msg: inject(Lang.translate("max_num_questions_error"), {
        max_questions: MAX_QUESTION_PER_COURSE,
      }),
    });
  }
}

export class NoCourseNameError extends BaseError {
  constructor() {
    super({
      msg: Lang.translate("no_course_name_error"),
    });
  }
}
