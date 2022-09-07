import passport from "passport"
import localPassport from "passport-local"
import { User } from "./models/user.js"

// Authentication
passport.use(new localPassport.Strategy(
    async function (username, password, done) {
        try {
            const user = await User.findOne({ where: { username: username } })
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' })
            }
            const passVal = user.validPassword(password)
            if (!passVal) {
                return done(null, false, { message: 'Incorrect password.' })
            }
            return done(null, user);
        } catch (err) {
            return done(err)
        }
    }
))

// Determines which information to save in the session
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// Get user from the session
passport.deserializeUser(function (id, done) {
    User.findByPk(id).then((user) =>
    {
        done(null, user);
    });
});

export default passport;