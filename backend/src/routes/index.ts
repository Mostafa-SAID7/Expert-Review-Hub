import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import foodsRouter from "./foods";
import trackerRouter from "./tracker";
import plansRouter from "./plans";
import recipesRouter from "./recipes";
import dashboardRouter from "./dashboard";
import profileRouter from "./profile";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(foodsRouter);
router.use(trackerRouter);
router.use(plansRouter);
router.use(recipesRouter);
router.use(dashboardRouter);
router.use(profileRouter);

export default router;
