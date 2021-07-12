"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport_1 = __importDefault(require("passport"));
var getToken_1 = require("../Functions/getToken");
var express_1 = require("express");
var index_1 = require("../models/index");
var option6Router = express_1.Router();
/*
Header-Content:
  Authorisation - token

Body-Content:
  service = LearnEnglish or LearnCooking
*/
option6Router.post("/addServices", passport_1.default.authenticate("jwt", { session: false }), function (req, res) {
    var token = getToken_1.getToken(req.headers);
    if (token) {
        var type_1 = req.body.service;
        var output_1 = {};
        var amount_1;
        index_1.Services.findOne({
            name: type_1,
        }, function (err, service) {
            if (err)
                throw err;
            if (!service) {
                res.send("No service found");
            }
            else {
                amount_1 = service.price;
                index_1.User.findOne({ username: req.user.username }, function (err, user) {
                    if (err)
                        throw err;
                    if (!user) {
                        res.status(401).send({
                            success: false,
                            msg: "Authentication failed. User not found.",
                        });
                    }
                    else {
                        if (user.balance < amount_1)
                            res.send("Recharge required");
                        else {
                            user.balance = Number(user.balance - amount_1);
                            user.services.push(type_1);
                            output_1.name = service.name;
                            output_1.done = "Services Subscribed Successfully";
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
            }
        });
    }
    else {
        return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
});
exports.default = option6Router;
