"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport_1 = __importDefault(require("passport"));
var passport_2 = __importDefault(require("../config/passport"));
var getToken_1 = require("../Functions/getToken");
var express_1 = require("express");
var index_1 = require("../models/index");
passport_2.default(passport_1.default);
var option1Router = express_1.Router();
option1Router.get("/balance", passport_1.default.authenticate("jwt", { session: false }), function (req, res) {
    var token = getToken_1.getToken(req.headers);
    if (token) {
        index_1.User.findOne({
            username: req.user.username,
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
                res.send("Current Balance is " + user.balance);
            }
        });
    }
    else {
        return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
});
exports.default = option1Router;
