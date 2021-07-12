import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
const schema = mongoose.Schema;

const userSchema = new schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  balance: {
    type: Number,
    required: true,
  },
  basepack: {
    type: String,
  },
  channels: {
    type: Array,
  },
  services: {
    type: Array,
  },
});

userSchema.pre("save", function (next) {
  let user: any = this;
  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function (err: Error|undefined, salt: any) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = function (passw, cb) {
  let user: any = this;
  bcrypt.compare(passw, user.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }
    cb(null, isMatch);
  });
};

const User = mongoose.model("User", userSchema);
export { User };
