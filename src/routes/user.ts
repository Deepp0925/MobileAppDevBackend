import { Router } from "express";
import { BaseError } from "../errors";
import { Response } from "../response";
import { UserModel } from "../schema";
import { SessionValidators } from "../validators";

export const userRouter = Router();

userRouter.post(
  "/login",
  SessionValidators.email,
  SessionValidators.password,
  (req, res) => {
    UserModel.login({
      email: req.body.email,
      password: req.body.password,
    })
      .then((data) => res.json(new Response({ data }).response))
      .catch((err: BaseError) => res.status(err.statusCode).json(err.error));
  }
);

userRouter.post(
  "/register",
  // SessionValidators.emptyRegistrationForm,
  // SessionValidators.email,
  // SessionValidators.password,
  (req, res) => {
    console.log(req.body);
    UserModel.register({
      email: req.body.email,
      password: req.body.password,
      fullname: req.body.fullname,
    })
      .then((data) => res.json(new Response({ data }).response))
      .catch((err: BaseError) => {
        console.log(err);
        res.status(err.statusCode).json(err.error);
      });
  }
);

userRouter.get("/:id", SessionValidators.isUserIDObjectID, (req, res) => {
  UserModel.fetchAcct({
    userId: req.params.id,
  })
    .then((data) => res.json(new Response({ data }).response))
    .catch((err: BaseError) => res.status(err.statusCode).json(err.error));
});

userRouter.put(
  "/points",
  SessionValidators.matchHeaderUserIDinBodyID,
  (req, res) => {
    UserModel.findById(req.body.userId)
      .then((user) =>
        user?.updatePoints({ points: req.body.points, course: req.body.course })
      )
      .then((data) => res.json(new Response({ data }).response))
      .catch((err: BaseError) => res.status(err.statusCode).json(err.error));
  }
);

export default userRouter;
