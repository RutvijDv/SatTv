"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport_1 = __importDefault(require("passport"));
var getToken_1 = require("../Functions/getToken");
var express_1 = require("express");
var index_1 = require("../models/index");
var option7Router = express_1.Router();
/*
Header-Content:
  Authorisation - token
*/
option7Router.get("/details", passport_1.default.authenticate("jwt", { session: false }), function (req, res) {
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
                var output = {};
                output.subscriptions = user.basepack;
                output.channelsAdded = user.channels;
                output.services = user.services;
                res.send(output);
            }
        });
    }
    else {
        return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
});
exports.default = option7Router;
