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
  service = LearnEnglish or LearnCooking
*/

router.post(
  "/addServices",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    var token = getToken(req.headers);
    if (token) {
      var type = req.body.service;

      var output = {};

      Services.findOne(
        {
          name: type,
        },
        function (err, service) {
          if (err) throw err;
          if (!service) {
            res.send("No service found");
          } else {
            amount = service.price;

            User.findOne({ username: req.user.username }, function (err, user) {
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
                  user.services.push(type);

                  output.name = service.name;
                  output.done = "Services Subscribed Successfully";
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
            });
          }
        }
      );
    } else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

module.exports = router;
