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
  email
  phone
*/

router.post(
  "/updateDetails",
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    var token = getToken(req.headers);
    if (token) {
      var email = req.body.email;
      var phone = req.body.phone;

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
            if (phone) user.phone = phone;
            if (email) user.email = email;

            user.save(function (err) {
              if (err) throw err;
              else res.send("Email and Phone updated successfully");
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
