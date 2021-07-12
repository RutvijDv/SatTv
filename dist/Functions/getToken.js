"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = void 0;
var getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(" ");
        if (parted.length === 2) {
            return parted[1];
        }
        else {
            return null;
        }
    }
    else {
        return null;
    }
};
exports.getToken = getToken;
