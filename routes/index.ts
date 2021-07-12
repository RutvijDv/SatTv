import { Router } from "express";
const router = Router();

//API version 1
router.use("/", require("./users"));
router.use("/", require("./Option1"));
router.use("/", require("./Option2"));
router.use("/", require("./Option3"));
router.use("/", require("./Option4"));
router.use("/", require("./Option5"));
router.use("/", require("./Option6"));
router.use("/", require("./Option6"));
router.use("/", require("./Option7"));

export { router };
