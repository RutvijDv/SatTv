var mongoose = require("mongoose");
var passport = require("passport");
var config = require("../config/database");
require("../config/passport")(passport);
var express = require("express");
var jwt = require("jsonwebtoken");
var router = express.Router();
var getToken = require("../Functions/getToken");

const { User, BasePack, Channels, Services } = require("../models/index");

/*
Header-Content:
  Authorisation - token
*/

router.get(
  "/details",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    var token = getToken(req.headers);
    if (token) {
      User.findOne(
        {
          username: req.user.username,
        },
        function (err, user) {
          if (err) throw err;

          if (!user) {
            res.status(401).send({
              success: false,
              msg: "Authentication failed. User not found.",
            });
          } else {
            var output = {};

            output.subscriptions = user.basepack;
            output.channelsAdded = user.channels;
            output.services = user.services;

            res.send(output);
          }
        }
      );
    } else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

module.exports = router;
