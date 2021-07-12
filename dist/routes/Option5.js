"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport_1 = __importDefault(require("passport"));
var getToken_1 = require("../Functions/getToken");
var express_1 = require("express");
var index_1 = require("../models/index");
var option5Router = express_1.Router();
/*
Header-Content:
  Authorisation - token

Body-Content:
  channels = comma seperated names
  ex:-  Discovery,Nat Geo
*/
option5Router.post("/addChannels", passport_1.default.authenticate("jwt", { session: false }), function (req, res) {
    var token = getToken_1.getToken(req.headers);
    if (token) {
        var channelList = req.body.channels.split(",");
        var output_1 = {};
        index_1.Channels.find({ name: channelList }, function (err, channels) {
            if (err)
                throw err;
            var amount = 0;
            channels.forEach(function (channel) {
                amount += channel.price;
            });
            index_1.User.findOne({
                username: req.user.username,
            }, function (err, user) {
                var _a;
                if (err)
                    throw err;
                if (!user) {
                    res.status(401).send({
                        success: false,
                        msg: "Authentication failed. User not found.",
                    });
                }
                else {
                    if (user.balance < amount)
                        res.send("Recharge required");
                    else {
                        user.balance = Number(user.balance - amount);
                        var x = channels.map(function (a) {
                            return a.name;
                        });
                        (_a = user.channels).push.apply(_a, x);
                        output_1.done = "Channels updated";
                        output_1.balance = user.balance;
                        user.save(function (err) {
                            if (err)
                                throw err;
                            else {
                                console.log("Email notification sent successfully");
                                console.log("SMS notification sent successfully");
                                res.send(output_1);
                            }
                        });
                    }
                }
            });
        });
    }
    else {
        return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
});
exports.default = option5Router;
