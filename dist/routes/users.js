"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var index_1 = require("../models/index");
var database_1 = require("../config/database");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var userRouter = express_1.Router();
/*

Body-Content:
  username
  password

*/
userRouter.post("/signup", function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({ success: false, msg: "Please pass username and password." });
    }
    else {
        var newUser = new index_1.User({
            username: req.body.username,
            password: req.body.password,
            balance: 100,
        });
        // save the user
        newUser.save(function (err) {
            if (err) {
                return res.json({ success: false, msg: "Username already exists." });
            }
            res.json({ success: true, msg: "Successful created new user." });
        });
    }
});
userRouter.post("/login", function (req, res) {
    index_1.User.findOne({
        username: req.body.username,
    }, function (err, user) {
        if (err)
            throw err;
        if (!user) {
            res.status(401).send({
                success: false,
                msg: "Authentication failed. User not found.",
            });
        }
        else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jsonwebtoken_1.default.sign(user.toJSON(), database_1.Config.secret);
                    // return the information including token as JSON
                    res.json({ success: true, token: "JWT " + token });
                }
                else {
                    res.status(401).send({
                        success: false,
                        msg: "Authentication failed. Wrong password.",
                    });
                }
            });
        }
    });
});
exports.default = userRouter;
