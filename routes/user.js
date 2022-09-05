import { Router } from "express"
import * as userControllers from "../controllers/user.js";
import isNotAuthenticated from "../utils/isNotAuthenticated.js";
import isAuthenticated from "../utils/isAuthenticated.js";

const router = Router()

router.post("/newuser", isNotAuthenticated, userControllers.createUser);
router.post("/:id/joinserver", isAuthenticated, userControllers.joinServer);
router.post("/:id/addfriend", isAuthenticated, userControllers.addFriend);
router.put("/:id/updateuser", isAuthenticated, userControllers.updateUser);
router.put("/:id/acceptfriend", isAuthenticated, userControllers.acceptFriend);
router.delete("/:id/deletefriend", isAuthenticated, userControllers.deleteFriend);
router.delete("/:id/deleteuser", isAuthenticated, userControllers.deleteUser);
router.delete("/:id/leaveserver", isAuthenticated, userControllers.leaveServer);

export default router;