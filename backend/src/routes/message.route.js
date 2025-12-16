import express from 'express';
import { getAllContacts, sendMessage, getMessagesByUserId, getChatPartners } from '../controllers/message.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protectRoute);

router.get("/contacts", getAllContacts);

router.get("/chats", getChatPartners);

router.post("/:id", getMessagesByUserId);

router.post("/send/:id", sendMessage);

export default router;