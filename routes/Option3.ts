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
  "/packsAndChannels",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    var token = getToken(req.headers);
    var output = {};

    if (token) {
      BasePack.find({}, function (err, Packs) {
        if (err) throw err;
        output.packs = Packs;

        Channels.find({}, function (err, Packs) {
          if (err) throw err;
          output.channels = Packs;

          Services.find({}, function (err, Packs) {
            if (err) throw err;
            output.services = Packs;

            res.send(output);
          });
        });
      });
    } else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

module.exports = router;
