"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var passport_1 = __importDefault(require("passport"));
var getToken_1 = require("../Functions/getToken");
var express_1 = require("express");
var index_1 = require("../models/index");
var option3Router = express_1.Router();
/*
Header-Content:
  Authorisation - token
*/
option3Router.get("/packsAndChannels", passport_1.default.authenticate("jwt", { session: false }), function (req, res) {
    var token = getToken_1.getToken(req.headers);
    var output = {};
    if (token) {
        index_1.BasePack.find({}, function (err, Packs) {
            if (err)
                throw err;
            output.packs = Packs;
            index_1.Channels.find({}, function (err, Packs) {
                if (err)
                    throw err;
                output.channels = Packs;
                index_1.Services.find({}, function (err, Packs) {
                    if (err)
                        throw err;
                    output.services = Packs;
                    res.send(output);
                });
            });
        });
    }
    else {
        return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
});
exports.default = option3Router;
