import { Router } from "express"
import passport from "passport"
const router = Router()

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(200).send({message: 'Logged In Successful'})
});

router.get('/logout', function (req, res) {
	req.logout();
});

export default router;