import passport from "passport";
import { getToken } from "../Functions/getToken";
import { Router } from "express";
import { User } from "../models/index";

import authenticateUser from "../config/passport";
authenticateUser(passport);

const option8Router = Router();


/*
Header-Content:
  Authorisation - token

Body-Content: 
  email
  phone
*/

option8Router.post(
  "/updateDetails",
  passport.authenticate("jwt", { session: false }),
  function (req:any, res:any) {
    const token = getToken(req.headers);
    if (token) {
      let email = req.body.email;
      let phone = req.body.phone;

      User.findOne(
        {
          username: req.user.username,
        },
        function (err:Error, user:any) {
          if (err) throw err;

          if (!user) {
            res.status(401).send({
              success: false,
              msg: "Authentication failed. User not found.",
            });
          } else {
            if (phone) user.phone = phone;
            if (email) user.email = email;

            user.save(function (err:Error) {
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

export default option8Router;

