import passport from "passport";
import { getToken } from "../Functions/getToken";
import { Router } from "express";
import { User, Channels } from "../models/index";

import authenticateUser from "../config/passport";
authenticateUser(passport);

const option5Router = Router();

/*
Header-Content:
  Authorisation - token

Body-Content: 
  channels = comma seperated names
  ex:-  Discovery,Nat Geo
*/

option5Router.post(
  "/addChannels",
  passport.authenticate("jwt", { session: false }),
  function (req: any, res: any) {
    let token = getToken(req.headers);
    if (token) {
      let channelList = req.body.channels.split(",");
      let output:any = {}

      Channels.find({ name: channelList }, function (err:Error, channels:any) {
        if (err) throw err;

        let amount = 0;

        channels.forEach(function (channel:any) {
          amount += channel.price;
        });

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
              if (user.balance < amount) res.send("Recharge required");
              else {
                user.balance = Number(user.balance - amount);

                let x = channels.map(function (a:any) {
                  return a.name;
                });

                user.channels.push(...x);

                output.done = "Channels updated";
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
          }
        );
      });
    } else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

export default option5Router;
