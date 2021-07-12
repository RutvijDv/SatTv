import { Strategy, ExtractJwt } from "passport-jwt";

const jwtStrategy =  Strategy;
const extractJwt = ExtractJwt;

// load up the user model
import { User } from "../models/user";
import { Config } from "../config/database";// get db config file
import { PassportStatic } from "passport";

const authenticateUser = function (passport: PassportStatic) { 

  var opts = {
    jwtFromRequest: extractJwt.fromAuthHeaderWithScheme("jwt"),
    secretOrKey: Config.secret
  };

  passport.use(
    new jwtStrategy(opts, function (jwt_payload, done) {
      User.findOne({ id: jwt_payload.id }, function (err: Error, user: any) {
        if (err) {
          return done(err, false);
        }
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      });
    })
  );
};

export default authenticateUser;