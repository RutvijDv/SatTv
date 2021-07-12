"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var schema = mongoose_1.default.Schema;
var userSchema = new schema({
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
    var user = this;
    if (this.isModified("password") || this.isNew) {
        bcrypt_1.default.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt_1.default.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    }
    else {
        return next();
    }
});
userSchema.methods.comparePassword = function (passw, cb) {
    var user = this;
    bcrypt_1.default.compare(passw, user.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};
var User = mongoose_1.default.model("User", userSchema);
exports.User = User;
