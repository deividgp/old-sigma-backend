import { Router } from "express"
import * as loggedUserControllers from "../controllers/loggedUser.js";
import isAuthenticated from "../utils/isAuthenticated.js";

const router = Router()

router.get("/friends", isAuthenticated, loggedUserControllers.getFriends);
router.get("/pendingfriends", isAuthenticated, loggedUserControllers.getPendingFriends);
router.get("/servers", isAuthenticated, loggedUserControllers.getServers);
router.put("/joinserver", isAuthenticated, loggedUserControllers.joinServer);
router.delete("/leaveserver", isAuthenticated, loggedUserControllers.leaveServer);
router.put("/addfriend", isAuthenticated, loggedUserControllers.addFriend);
router.put("/acceptfriend", isAuthenticated, loggedUserControllers.acceptFriend);
router.delete("/:id/deletefriend", isAuthenticated, loggedUserControllers.deleteFriend);
router.delete("/:id/ignorefriend", isAuthenticated, loggedUserControllers.ignoreFriend);

export default router;