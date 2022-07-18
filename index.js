import dotenv from "dotenv"
dotenv.config({ path: '/config/.env' })
import passport from "passport"
import localPassport from "passport-local"
import { sequelize } from "./database.js"
import { User } from "./models/user.js"
import addData from "./addData.js";
import app from "./app.js";
const port = process.env.PORT || 3000;

// Authentication
passport.use(new localPassport.Strategy(
    async function(username, password, done) {
        try{
          const user = await User.findOne({where: { username: username }})
          if (!user){
              return done(null, false, { message: 'Incorrect username.' }) 
          }
          const passVal = user.validPassword(password)
          if(!passVal){
              return done(null, false, { message: 'Incorrect password.' })
          }
          return done(null, user);
        }catch(err){
            return done(err)
        }
    }
))

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findByPk(id).then(function(user) { done(null, user); });
});

app.listen(port, async () => {
    try
    {
        await sequelize.sync({force: true});
        await addData();
        console.log('Connected to database')
    }
    catch(error)
    {
        console.error(`Error: Cannot connect to database ${error}`)
    }
});