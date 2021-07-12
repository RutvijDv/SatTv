import passport, { Strategy } from "passport";
import { getToken } from "../Functions/getToken";
import { Router } from "express";
import { User } from "../models/index";

import authenticateUser from "../config/passport";
authenticateUser(passport);

const option1Router = Router();

option1Router.get(
  "/balance",
  passport.authenticate("jwt", { session: false }),
  function (req: any, res: any) {
    const token = getToken(req.headers);
    if (token) {
      User.findOne(
        {
          username: req.user.username,
        },
        function (err: Error, user: any) {
          if (err) throw err;

          if (!user) {
            res.status(401).send({
              success: false,
              msg: "Authentication failed. User not found.",
            });
          } else {
            res.send("Current Balance is " + user.balance);
          }
        }
      );
    } else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

export default option1Router;
