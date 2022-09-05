import { Router } from "express"
import * as userControllers from "../controllers/user.js";
import isNotAuthenticated from "../utils/isNotAuthenticated.js";
import isAuthenticated from "../utils/isAuthenticated.js";

const router = Router()

router.post("/newuser", isNotAuthenticated, userControllers.createUser);
router.post("/:id", isAuthenticated, userControllers.joinServer);
router.post("/:id", isAuthenticated, userControllers.addFriend);
router.put("/:id", isAuthenticated, userControllers.updateUser);
router.put("/:id", isAuthenticated, userControllers.acceptFriend);
router.delete("/:id", isAuthenticated, userControllers.deleteFriend);
router.delete("/:id", isAuthenticated, userControllers.deleteUser);
router.delete("/:id", isAuthenticated, userControllers.leaveServer);

export default router;