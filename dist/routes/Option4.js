"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport_1 = __importDefault(require("passport"));
var getToken_1 = require("../Functions/getToken");
var express_1 = require("express");
var index_1 = require("../models/index");
var option4Router = express_1.Router();
/*
Header-Content:
  Authorisation - token

Body-Content:
  type = "S" or "G"
  months
*/
option4Router.post("/subscribe", passport_1.default.authenticate("jwt", { session: false }), function (req, res) {
    var token = getToken_1.getToken(req.headers);
    if (token) {
        var type = req.body.type;
        var months_1 = Number(req.body.months);
        var discountPercentage_1 = months_1 >= 3 ? Number(10) : Number(0);
        var discount_1;
        var amount_1;
        var finalAmount_1;
        var output_1 = {};
        index_1.BasePack.findOne({
            type: type,
        }, function (err, pack) {
            if (err)
                throw err;
            if (!pack) {
                res.send("No packs found");
            }
            else {
                amount_1 = pack.price * months_1;
                discount_1 = (amount_1 * discountPercentage_1) / 100;
                finalAmount_1 = amount_1 - discount_1;
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
                        if (user.balance < finalAmount_1)
                            res.send("Recharge required");
                        else {
                            user.balance = Number(user.balance - finalAmount_1);
                            user.basepack = pack.name;
                            output_1.name = pack.name;
                            output_1.price = pack.price;
                            output_1.months = months_1;
                            output_1.subscriptionAmount = amount_1;
                            output_1.discount = discount_1;
                            output_1.finalPrice = finalAmount_1;
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
exports.default = option4Router;
