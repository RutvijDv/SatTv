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

let debug = require("debug")("sattv:server");

/**
 * Get port from environment and store in Express.
 */
let port = normalizePort(process.env.PORT || "3000");

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val:any): (number|string|boolean) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}


/**
 * Event listener for HTTP server "error" event.
 */
function onError(error:any) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

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

app.on("error", onError);

/**
 * Event listener for Express app "listening" event.
 */
app.listen(port,function(){
  console.log("Database Initialized");
})

export  default app;
