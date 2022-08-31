import { Router } from "express"
import * as serverControllers from "../controllers/server.js";

const router = Router()

router.post("/", serverControllers.createServer);
router.put("/:id", serverControllers.updateServer);
router.delete("/:id/delete", serverControllers.deleteServer);
router.get("/:id", serverControllers.getServerChannels);
router.get("/:id/users", serverControllers.getServerUsers);
router.post("/:id", serverControllers.addUserServer);
router.delete("/:id", serverControllers.deleteUserServer);

export default router;