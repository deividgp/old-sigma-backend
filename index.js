import dotenv from "dotenv"
dotenv.config({ path: './config/.env' })
import sequelize from "./database.js"
import addData from "./addData.js";
import passport from "./passport.js"
import app from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { UserChannelMessage } from "./models/userchannelmessage.js";

const port = process.env.PORT || 4000;
const server = createServer(app);
const io = new Server(server);

async function main(){
    await sequelize.sync({force: true});
    await addData();

    io.on("connection", (socket) => {
        
        
        socket.on("join_room", (data) => {
            socket.join(data);
        });
        
        socket.on("send_server_message", async (data) => {
            socket.to(data.room).emit("receive_server_message", data);
            console.log(data.userMessage);
            await UserChannelMessage.create({ id: data.userMessage.id, content: data.userMessage.content, UserId: data.userMessage.UserId, ChannelId: data.userMessage.ChannelId });
        });

        socket.on("disconnect", () => {
            console.log("disconnect");
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