import dotenv from "dotenv"
dotenv.config({ path: './config/.env' })
import sequelize from "./database.js"
import addData from "./addData.js";
import passport from "./passport.js"
import app from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";

const port = process.env.PORT || 4000;
const server = createServer(app);
const io = new Server(server);

async function main(){
    await sequelize.sync({force: true});
    await addData();

    io.on("connection", (socket) => {
        

        socket.on("disconnect", () => {
            socket.broadcast.emit("user disconnected", socket.id);
        });
    });

    server.listen(port, () => {
        try
        {
            console.log('Connected')
        }
        catch(error)
        {
            console.error(`Error: Cannot connect to database ${error}`)
        }
    });
}

await main();