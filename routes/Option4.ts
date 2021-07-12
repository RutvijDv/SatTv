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
  type = "S" or "G" 
  months
*/

router.post(
  "/subscribe",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    var token = getToken(req.headers);
    if (token) {
      var type = req.body.type;
      var months = Number(req.body.months);

      var discountPercentage = months >= 3 ? Number(10) : Number(0);
      var discount;
      var amount;
      var finalAmount;

      var output = {};

      BasePack.findOne(
        {
          type: type,
        },
        function (err, pack) {
          if (err) throw err;
          if (!pack) {
            res.send("No packs found");
          } else {
            amount = pack.price * months;
            discount = (amount * discountPercentage) / 100;
            finalAmount = amount - discount;

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
                  if (user.balance < finalAmount) res.send("Recharge required");
                  else {
                    user.balance = Number(user.balance - finalAmount);
                    user.basepack = pack.name;

                    output.name = pack.name;
                    output.price = pack.price;
                    output.months = months;
                    output.subscriptionAmount = amount;
                    output.discount = discount;
                    output.finalPrice = finalAmount;
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
          }
        }
      );
    } else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

module.exports = router;
