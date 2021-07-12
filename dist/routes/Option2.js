"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport_1 = __importDefault(require("passport"));
var getToken_1 = require("../Functions/getToken");
var express_1 = require("express");
var index_1 = require("../models/index");
var option2Router = express_1.Router();
/*
Header-Content:
  Authorisation - token

Body-Content:
  recharge amount
*/
option2Router.post("/recharge", passport_1.default.authenticate("jwt", { session: false }), function (req, res) {
    var token = getToken_1.getToken(req.headers);
    if (token) {
        var recharge_1 = Number(req.body.recharge);
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
                user.balance += recharge_1;
                user.save(function (err, saved) {
                    if (err)
                        throw err;
                    else
                        res.send("Recharge completed successfully. Current balance is " +
                            user.balance);
                });
            }
        });
    }
    else {
        return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
});
exports.default = option2Router;
