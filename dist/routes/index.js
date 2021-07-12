"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var users_1 = __importDefault(require("./users"));
var Option1_1 = __importDefault(require("./Option1"));
var Option2_1 = __importDefault(require("./Option2"));
var Option3_1 = __importDefault(require("./Option3"));
var Option4_1 = __importDefault(require("./Option4"));
var Option5_1 = __importDefault(require("./Option5"));
var Option6_1 = __importDefault(require("./Option6"));
var Option7_1 = __importDefault(require("./Option7"));
var Option8_1 = __importDefault(require("./Option8"));
var router = express_1.Router();
//API version 1
router.use("/", users_1.default);
router.use("/", Option1_1.default);
router.use("/", Option2_1.default);
router.use("/", Option3_1.default);
router.use("/", Option4_1.default);
router.use("/", Option5_1.default);
router.use("/", Option6_1.default);
router.use("/", Option7_1.default);
router.use("/", Option8_1.default);
exports.default = router;
