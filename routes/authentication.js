import { Router } from "express"
import passport from "../passport.js"
import isAuthenticated from "../utils/isAuthenticated.js";
import isNotAuthenticated from "../utils/isNotAuthenticated.js";
const router = Router()

router.post('/login', isNotAuthenticated, passport.authenticate('local'), (req, res) => {
    res.status(200).send(req.user)
});

router.get('/logout', isAuthenticated, function (req, res) {
	req.logout(function(err) {
        if (err) { return next(err); }
            res.status(200).send({message: 'Log Out Successful'});
    });
});

router.get("/user", (req, res) => {
    console.log(req.user);
    res.send(req.user);
});

export default router;