"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var passport_jwt_1 = require("passport-jwt");
var jwtStrategy = passport_jwt_1.Strategy;
var extractJwt = passport_jwt_1.ExtractJwt;
// load up the user model
var user_1 = require("../models/user");
var database_1 = require("../config/database"); // get db config file
var authenticateUser = function (passport) {
    var opts = {
        jwtFromRequest: extractJwt.fromAuthHeaderWithScheme("jwt"),
        secretOrKey: database_1.Config.secret
    };
    passport.use(new jwtStrategy(opts, function (jwt_payload, done) {
        user_1.User.findOne({ id: jwt_payload.id }, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            }
            else {
                done(null, false);
            }
        });
    }));
};
exports.default = authenticateUser;
