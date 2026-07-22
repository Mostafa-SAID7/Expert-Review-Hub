import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import foodsRouter from "./foods.js";
import trackerRouter from "./tracker.js";
import plansRouter from "./plans.js";
import recipesRouter from "./recipes.js";
import dashboardRouter from "./dashboard.js";
import profileRouter from "./profile.js";

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
