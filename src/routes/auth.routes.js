import express from "express";
import { getUser, logout, signin, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router =express.Router();

router.post("/signup",signup)
router.post("/signin",signin)

router.get("/getuser",protectRoute,getUser)
router.get("/logout",protectRoute,logout)
router.put("/updateProfile",protectRoute,updateProfile)

export default router;