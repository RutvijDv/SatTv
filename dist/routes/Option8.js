"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport_1 = __importDefault(require("passport"));
var getToken_1 = require("../Functions/getToken");
var express_1 = require("express");
var index_1 = require("../models/index");
var option8Router = express_1.Router();
/*
Header-Content:
  Authorisation - token

Body-Content:
  email
  phone
*/
option8Router.post("/updateDetails", passport_1.default.authenticate("jwt", { session: false }), function (req, res) {
    var token = getToken_1.getToken(req.headers);
    if (token) {
        var email_1 = req.body.email;
        var phone_1 = req.body.phone;
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
                if (phone_1)
                    user.phone = phone_1;
                if (email_1)
                    user.email = email_1;
                user.save(function (err) {
                    if (err)
                        throw err;
                    else
                        res.send("Email and Phone updated successfully");
                });
            }
        });
    }
    else {
        return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
});
exports.default = option8Router;
