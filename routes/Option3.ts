import passport from "passport";
import { getToken } from "../Functions/getToken";
import { Router } from "express";

import {BasePack, Channels, Services } from "../models/index";

const router = Router();


/*
Header-Content:
  Authorisation - token
*/

router.get(
  "/packsAndChannels",
  passport.authenticate("jwt", { session: false }),
  function (req: any, res: any) {
    const token = getToken(req.headers);
    let output = {}  as any;

    if (token) {
      BasePack.find({}, function (err: Error,Packs:any) {
        if (err) throw err;
        output.packs = Packs;

        Channels.find({}, function (err: Error,Packs:any) {
          if (err) throw err;
          output.channels = Packs;

          Services.find({}, function (err: Error,Packs:any) {
            if (err) throw err;
            output.services = Packs;

            res.send(output);
          });
        });
      });
    } else {
      return res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

export { router };
