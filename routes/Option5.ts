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

Body-Content: 
  channels = comma seperated names
  ex:-  Discovery,Nat Geo
*/

router.post(
  "/addChannels",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    var token = getToken(req.headers);
    if (token) {
      var channelList = req.body.channels.split(",");
      var output = {};

      Channels.find({ name: channelList }, function (err, channels) {
        if (err) throw err;

        var amount = 0;

        channels.forEach(function (channel) {
          amount += channel.price;
        });

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
              if (user.balance < amount) res.send("Recharge required");
              else {
                user.balance = Number(user.balance - amount);

                var x = channels.map(function (a) {
                  return a.name;
                });

                user.channels.push(...x);

                output.done = "Channels updated";
                output.balance = user.balance;

                user.save(function (err) {
                  if (err) throw err;
                  else {
                    console.log("Email notification sent successfully");
                    console.log("SMS notification sent successfully");
                    res.send(output);
                  }
                });
              }
            }
          }
        );
      });
    } else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

module.exports = router;
