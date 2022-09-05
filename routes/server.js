import { Router } from "express"
import * as serverControllers from "../controllers/server.js";
import isAuthenticated from "../utils/isAuthenticated.js";

const router = Router()

router.get("/:id", isAuthenticated, serverControllers.getServerChannels);
router.get("/:id/users", isAuthenticated, serverControllers.getServerUsers);
router.post("/", isAuthenticated, serverControllers.createServer);
router.post("/:id", isAuthenticated, serverControllers.addUserServer);
router.put("/:id", isAuthenticated, serverControllers.updateServer);
router.delete("/:id/delete", isAuthenticated, serverControllers.deleteServer);
router.delete("/:id/:userId", isAuthenticated, serverControllers.deleteUserServer);

export default router;