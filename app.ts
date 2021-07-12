import { Config } from "./config/database";
import express from "express";
import path from "path";
import mongoose from "mongoose";
import passport from "passport";
import createError  from "http-errors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import * as utils from "./Functions/databaseInitiator";
import cors from "cors";
import router from "./routes/index";

const app = express();

mongoose.connect(Config.database, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", router);
utils.packsDb();
utils.channelsDb();
utils.servicesDb();

app.use(cors());
app.use(passport.initialize());

app.get("/", function (req: any, res: any) {
  res.send("Welcome To SatTV");
});

// catch 404 and forward to error handler
app.use(function (req: any, res: any, next: any) {
  next(createError(404));
});

// error handler
app.use(function (err:any, req:any, res:any) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export  default app ;
