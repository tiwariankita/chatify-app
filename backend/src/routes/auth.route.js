// const express = require ('express');
import express from 'express';
import { signup, login, logout, updateProfile } from '../controllers/auth.controller.js';
import {protectRoute} from '../middlewares/auth.middleware.js';
import { arcjetProtection } from '../middlewares/arcjet.middleware.js';
const router = express.Router();

// router.get("/arcjet", arcjetProtection, (req, res) => {
//     res.status(200).json({message: "success"});
// }); test code

router.use(arcjetProtection); // middleware is called before any end point is hit for rate limiting

router.post("/signup", signup);

router.post( "/login", login);

router.post("/logout", logout);

router.put("/updateProfile", protectRoute, updateProfile);

router.get("/check", protectRoute, (req, res) => {
    res.status(200).json(req.user);
    console.log("Authenticated");
});

export default router;