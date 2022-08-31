import { Router } from "express"
import * as channelControllers from "../controllers/channel.js";

const router = Router()

router.get("/:id/messages", channelControllers.getChannelMessages);
router.post("/", channelControllers.createChannel);
router.put("/:id", channelControllers.updateChannel);
router.delete("/:id", channelControllers.deleteChannel);

export default router;