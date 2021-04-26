import { Router } from "express";
import { BaseError } from "../errors";
import { Response } from "../response";
import { TopicModel } from "../schema";
import { SessionValidators } from "../validators";

export const topicsRouter = Router();

topicsRouter.get("/", (req, res) => {
  const skip = typeof req.query.skip === "number" ? req.query.skip : 0;
  TopicModel.fetchAll({
    skip,
  })
    .then((data) => res.json(new Response({ data }).response))
    .catch((err: BaseError) => res.status(err.statusCode).json(err.error));
});

topicsRouter.post("/new", SessionValidators.guardAdmin, (req, res) => {
  TopicModel.new({ name: req.body.name })
    .then((data) => res.json(new Response({ data }).response))
    .catch((err: BaseError) => res.status(err.statusCode).json(err.error));
});

export default topicsRouter;
