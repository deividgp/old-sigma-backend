import dotenv from "dotenv"
dotenv.config({ path: '/config/.env' })
import helmet from "helmet"
import morgan from "morgan"
import express from "express"
import passport from "passport"
import cors from "cors"
import { sequelize } from "./database.js"
import { User } from "./models/user.js"
import { Server } from "./models/server.js"
import { UserFriends } from "./models/userfriends.js"
import { UserMessageUsers } from "./models/usermessageusers.js"
import { UserServers } from "./models/userservers.js"
import { UserChannelMessage } from "./models/userchannelmessage.js"
import { Channel } from "./models/channel.js"

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('combined'))
app.use(helmet());
app.use(express.json());
app.use(cors({
    origin: 'http://yourapp.com'
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, async () => {
    try
    {
        await sequelize.sync({force: true});
        console.log('Connected to database')
    }
    catch(error)
    {
        console.error(`Error: Cannot connect to database ${error}`)
    }
})