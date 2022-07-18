import { Router } from "express"
import {
    createServer,
    updateServer,
    deleteServer,
    getServerChannels,
    getServerUsers,
    addUserServer,
    deleteUserServer,
} from "../controllers/server.js";

const router = Router()

router.post("/", createServer);
router.put("/:id", updateServer);
router.delete("/:id", deleteServer);
router.get("/:id", getServerChannels);
router.get("/:id", getServerUsers);
router.post("/:id", addUserServer);
router.delete("/:id", deleteUserServer);

export default router;