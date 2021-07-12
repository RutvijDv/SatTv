import { Router } from "express";
import { User } from "../models/index";
import { Config } from "../config/database";
import jwt from "jsonwebtoken";

const userRouter = Router();

/*

Body-Content: 
  username
  password

*/

userRouter.post("/signup", function (req:any, res:any) {
  if (!req.body.username || !req.body.password) {
    res.json({ success: false, msg: "Please pass username and password." });
  } else {
    let newUser = new User({
      username: req.body.username,
      password: req.body.password,
      balance: 100,
    });
    // save the user
    newUser.save(function (err:Error) {
      if (err) {
        return res.json({ success: false, msg: "Username already exists." });
      }
      res.json({ success: true, msg: "Successful created new user." });
    });
  }
});

userRouter.post("/login", function (req, res) {
  User.findOne(
    {
      username: req.body.username,
    },
    function (err:Error, user:any) {
      if (err) throw err;

      if (!user) {
        res.status(401).send({
          success: false,
          msg: "Authentication failed. User not found.",
        });
      } else {
        // check if password matches
        user.comparePassword(req.body.password, function (err:Error, isMatch:any) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            const token = jwt.sign(user.toJSON(), Config.secret);
            // return the information including token as JSON
            res.json({ success: true, token: "JWT " + token });
          } else {
            res.status(401).send({
              success: false,
              msg: "Authentication failed. Wrong password.",
            });
          }
        });
      }
    }
  );
});

export default userRouter ;
