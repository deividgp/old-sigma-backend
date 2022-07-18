import { Router } from "express"
import {
    createUser,
    updateUser,
    deleteUser,
    joinServer,
    leaveServer,
    addFriend,
    deleteFriend,
    acceptFriend,
} from "../controllers/user.js";

const router = Router()

router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/:id", joinServer);
router.delete("/:id", leaveServer);
router.post("/:id", addFriend);
router.put("/:id", acceptFriend);
router.delete("/:id", deleteFriend);

export default router;