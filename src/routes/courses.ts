import { Router } from "express";
import { BaseError } from "../errors";
import { Response } from "../response";
import { CoursesModel } from "../schema";
import { SessionValidators } from "../validators";

export const coursesRouter = Router();

coursesRouter.get("/:topic", (req, res) => {
  const skip = typeof req.query.skip === "number" ? req.query.skip : 0;
  CoursesModel.fetchCourses({ topicId: req.params.topic, skip })
    .then((data) => res.json(new Response({ data }).response))
    .catch((err: BaseError) => res.status(err.statusCode).json(err.error));
});

coursesRouter.post("/new", SessionValidators.guardAdmin, (req, res) => {
  CoursesModel.new({
    name: req.body.name,
    topic: req.body.topic,
    questions: req.body.questions,
  })
    .then((data) => res.json(new Response({ data }).response))
    .catch((err: BaseError) => res.status(err.statusCode).json(err.error));
});

export default coursesRouter;
