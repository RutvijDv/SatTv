import passport from "passport";
import { getToken } from "../Functions/getToken";
import { Router } from "express";
import { User, BasePack } from "../models/index";

import authenticateUser from "../config/passport";
authenticateUser(passport);

const option4Router = Router();

/*
Header-Content:
  Authorisation - token

Body-Content: 
  type = "S" or "G" 
  months
*/

option4Router.post(
  "/subscribe",
  passport.authenticate("jwt", { session: false }),
  function (req: any, res: any) {
    const token = getToken(req.headers);
    if (token) {
      let type = req.body.type;
      let months = Number(req.body.months);

      let discountPercentage = months >= 3 ? Number(10) : Number(0);
      let discount : number;
      let amount : number;
      let finalAmount : number;

      let output:any = {}

      BasePack.findOne(
        {
          type: type,
        },
        function (err:Error, pack:any) {
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
              function (err:Error, user:any) {
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
          }
        }
      );
    } else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

export default option4Router;
