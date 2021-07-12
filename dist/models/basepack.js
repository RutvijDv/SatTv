"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePack = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var schema = mongoose_1.default.Schema;
var basePackSchema = new schema({
    type: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    channels: [String],
    price: {
        type: Number,
        required: true,
    },
});
var BasePack = mongoose_1.default.model("BasePack", basePackSchema);
exports.BasePack = BasePack;
