import { Router } from "express"
import * as loggedUserControllers from "../controllers/loggedUser.js";
import isAuthenticated from "../utils/isAuthenticated.js";

const router = Router()

router.get("/friends", isAuthenticated, loggedUserControllers.getFriends);
router.get("/servers", isAuthenticated, loggedUserControllers.getServers);
router.post("/joinserver", isAuthenticated, loggedUserControllers.joinServer);
router.delete("/leaveserver", isAuthenticated, loggedUserControllers.leaveServer);
router.post("/addfriend", isAuthenticated, loggedUserControllers.addFriend);
router.put("/acceptfriend", isAuthenticated, loggedUserControllers.acceptFriend);
router.delete("/addfriend", isAuthenticated, loggedUserControllers.deleteFriend);

export default router;