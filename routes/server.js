import { Router } from "express"
import * as serverControllers from "../controllers/server.js";

const router = Router()

router.get("/:id", serverControllers.getServerChannels);
router.get("/:id/users", serverControllers.getServerUsers);
router.post("/", serverControllers.createServer);
router.post("/:id", serverControllers.addUserServer);
router.put("/:id", serverControllers.updateServer);
router.delete("/:id/delete", serverControllers.deleteServer);
router.delete("/:id/:userId", serverControllers.deleteUserServer);

export default router;