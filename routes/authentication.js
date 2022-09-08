import { Router } from "express"
import passport from "../passport.js"
import isAuthenticated from "../utils/isAuthenticated.js";
import isNotAuthenticated from "../utils/isNotAuthenticated.js";
import { FindSimilar } from "../recognition.js";
import { User } from "../models/user.js";
const router = Router()

router.post('/login', isNotAuthenticated, passport.authenticate('local'), (req, res) => {
    res.status(200).send(req.user)
});

router.post("/loginface", isNotAuthenticated, async (req, res) => {

    try {
        const username = await FindSimilar(req.files[0].buffer);
        const user = await User.findOne({ where: { username: username } });
        req.login(user, () => {
            return res.json(user);
        });
    } catch (error) {
        return res.sendStatus(500);
    }
});

router.get('/logout', isAuthenticated, function (req, res) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.status(200).send({ message: 'Log Out Successful' });
    });
});

router.get("/user", isAuthenticated, (req, res) => {
    res.status(200).send(req.user);
});

export default router;