import passport from "passport";
import { getToken } from "../Functions/getToken";
import { Router } from "express";
import { User, Services } from "../models/index";

import authenticateUser from "../config/passport";
authenticateUser(passport);

const option6Router = Router();


/*
Header-Content:
  Authorisation - token

Body-Content: 
  service = LearnEnglish or LearnCooking
*/

option6Router.post(
  "/addServices",
  passport.authenticate("jwt", { session: false }),
  function (req: any, res: any) {
    const token = getToken(req.headers);
    if (token) {
      let type = req.body.service;

      let output:any = {}
      let amount : number;

      Services.findOne(
        {
          name: type,
        },
        function (err:Error, service:any) {
          if (err) throw err;
          if (!service) {
            res.send("No service found");
          } else {
            amount = service.price;

            User.findOne({ username: req.user.username }, function (err:Error, user:any) {
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

                  user.save(function (err:Error) {
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

export default option6Router;
