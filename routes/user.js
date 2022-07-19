import { Router } from "express"
import * as userControllers from "../controllers/user.js";

const router = Router()

router.post("/", userControllers.createUser);
router.put("/:id", userControllers.updateUser);
router.delete("/:id", userControllers.deleteUser);
router.post("/:id", userControllers.joinServer);
router.delete("/:id", userControllers.leaveServer);
router.post("/:id", userControllers.addFriend);
router.put("/:id", userControllers.acceptFriend);
router.delete("/:id", userControllers.deleteFriend);

export default router;