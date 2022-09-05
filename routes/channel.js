import { Router } from "express"
import * as channelControllers from "../controllers/channel.js";
import isAuthenticated from "../utils/isAuthenticated.js";

const router = Router()

router.get("/:id/messages", isAuthenticated, channelControllers.getChannelMessages);
router.post("/", isAuthenticated, channelControllers.createChannel);
router.put("/:id", isAuthenticated, channelControllers.updateChannel);
router.delete("/:id", isAuthenticated, channelControllers.deleteChannel);

export default router;