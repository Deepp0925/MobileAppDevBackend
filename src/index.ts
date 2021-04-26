import "dotenv/config";
import { connect } from "mongoose";
import express from "express";
import { coursesRouter, topicsRouter, userRouter } from "./routes";
import { json, urlencoded } from "body-parser";
import { join } from "path";

const PORT = process.env.PORT || 8080;

// setting up express app
const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());
app.use("/user", userRouter);
app.use("/topic", topicsRouter);
app.use("/course", coursesRouter);
// is in production

app.use("/", express.static(join(__dirname, "..", "..", "views", "build")));

// starts the express app and connects to mongodb
app.listen(PORT, () => {
  connect(process.env.DB_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).catch((err) => console.log("err connecting to db", err));
});
