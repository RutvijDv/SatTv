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
  recharge amount
*/

router.post(
  "/recharge",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    var token = getToken(req.headers);
    if (token) {
      var recharge = Number(req.body.recharge);

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
            user.balance += recharge;
            user.save((err, saved) => {
              if (err) throw err;
              else
                res.send(
                  "Recharge completed successfully. Current balance is " +
                    user.balance
                );
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
