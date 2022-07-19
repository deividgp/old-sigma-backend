import { Router } from "express"
import * as channelControllers from "../controllers/channel.js";

const router = Router()

router.post("/", channelControllers.createChannel);
router.put("/:id", channelControllers.updateChannel);
router.delete("/:id", channelControllers.deleteChannel);
router.get("/:id", channelControllers.getChannelMessages);

export default router;