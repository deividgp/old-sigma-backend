import { Router } from "express"
import * as userControllers from "../controllers/user.js";

const router = Router()

router.post("/newuser", userControllers.createUser);
router.post("/:id", userControllers.joinServer);
router.post("/:id", userControllers.addFriend);
router.put("/:id", userControllers.updateUser);
router.put("/:id", userControllers.acceptFriend);
router.delete("/:id", userControllers.deleteFriend);
router.delete("/:id", userControllers.deleteUser);
router.delete("/:id", userControllers.leaveServer);

export default router;