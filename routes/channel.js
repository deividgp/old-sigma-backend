import { Router } from "express"
import {
    createChannel,
    updateChannel,
    deleteChannel,
    getChannelMessages,
} from "../controllers/channel.js";

const router = Router()

router.post("/", createChannel);
router.put("/:id", updateChannel);
router.delete("/:id", deleteChannel);
router.get("/:id", getChannelMessages);

export default router;