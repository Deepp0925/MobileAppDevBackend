import "dotenv/config";
import { connect } from "mongoose";
import express from "express";
import { coursesRouter, topicsRouter, userRouter } from "./routes";
import { json, urlencoded } from "body-parser";
import cors from "cors";
import helmet from "helmet";
import { resolve } from "path";

const PORT = process.env.PORT || 8080;

// setting up express app
const app = express();
app.use(cors());
app.use(helmet());
app.use(urlencoded({ extended: true }));
app.use(json());
app.use("/user", userRouter);
app.use("/topic", topicsRouter);
app.use("/course", coursesRouter);
// is in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("./views/build"));

  app.get("*", resolve(__dirname, "views", "build", "index.html") as any);
}

// starts the express app and connects to mongodb
app.listen(PORT, () => {
  connect(process.env.DB_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).catch((err) => console.log("err connecting to db", err));
});
