import passport from "passport";
import { getToken } from "../Functions/getToken";
import { Router } from "express";
import { User } from "../models/index";

import authenticateUser from "../config/passport";
authenticateUser(passport);

const option2Router = Router();

/*
Header-Content:
  Authorisation - token

Body-Content: 
  recharge amount
*/

option2Router.post(
  "/recharge",
  passport.authenticate("jwt", { session: false }),
  function (req: any, res: any) {
    const token = getToken(req.headers);
    if (token) {
      let recharge = Number(req.body.recharge);

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
            user.balance += recharge;
            user.save((err: Error, saved:any) => {
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

export default option2Router;
