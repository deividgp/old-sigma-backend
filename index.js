import dotenv from "dotenv"
dotenv.config({ path: './config/.env' })
import sequelize from "./database.js"
import addData from "./addData.js";
import passport from "./passport.js"
import app from "./app.js";

const port = process.env.PORT || 3000;

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