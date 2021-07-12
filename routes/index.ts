import { Router } from "express";
import userRouter from "./users";
import option1Router from "./Option1";
import option2Router from "./Option2";
import option3Router from "./Option3";
import option4Router from "./Option4";
import option5Router from "./Option5";
import option6Router from "./Option6";
import option7Router from "./Option7";
import option8Router from "./Option8";

const router = Router();



//API version 1
router.use("/", userRouter);
router.use("/", option1Router);
router.use("/", option2Router);
router.use("/", option3Router);
router.use("/", option4Router);
router.use("/", option5Router);
router.use("/", option6Router);
router.use("/", option7Router);
router.use("/", option8Router);


export default router;
