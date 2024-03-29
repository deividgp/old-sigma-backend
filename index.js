import dotenv from "dotenv"
dotenv.config();
import sequelize from "./database.js"
import addData from "./addData.js";
import io from "./io.js";
import { UserChannelMessage } from "./models/userchannelmessage.js";
import { UserUserMessages } from "./models/userusermessages.js";
import { createPersonGroup } from "./recognition.js";

const users = [];
const activeUsers = [];

async function main() {
    if (process.env.NODE_ENV == "production") {
        await sequelize.sync({ alter: true });
    } else {
        await sequelize.sync({ force: true });
        await addData();
    }
    await createPersonGroup();
    io.use((socket, next) => {
        socket.userid = socket.handshake.auth.userid;
        next();
    });

    io.on("connection", (socket) => {
        if (socket.userid != undefined) {
            const index = users.findIndex(user => user.userid == socket.userid);

            if (index == -1) {
                users.push({
                    userid: socket.userid,
                    ids: [socket.id]
                });
                activeUsers.push(socket.userid);
                io.sockets.emit("online_users", activeUsers);
            }
            else {
                users[index].ids.push(socket.id);
            }
        }

        socket.on("get_online_users", () => {
            socket.emit("online_users", activeUsers);
        });

        socket.on("join_room", (data) => {
            socket.join(data);
        });

        socket.on("leave_room", (data) => {
            socket.leave(data);
        });

        socket.on("action", (data) => {
            socket.to(data.room).emit(data.action, data);
        });

        socket.on("send_server_message", async (data) => {
            socket.to(data.room).emit("receive_server_message", data);
            await UserChannelMessage.create({ id: data.userMessage.id, content: data.userMessage.content, UserId: data.userMessage.UserId, ChannelId: data.userMessage.ChannelId });
        });

        socket.on("send_private_message", async (data) => {
            const room = data.room;
            data.room = data.userMessage.UserId;
            socket.to(room).emit("receive_private_message", data);
            await UserUserMessages.create({ id: data.userMessage.id, content: data.userMessage.content, UserId: data.userMessage.UserId, MessageUserId: data.userMessage.MessageUserId });
        });

        socket.on("disconnect", () => {
            console.log("disconnect");
            const usersIndex = users.findIndex(user => user.userid == socket.userid);

            if (usersIndex === -1) return;

            users[usersIndex].ids.splice(users[usersIndex].ids.indexOf(socket.id), 1);

            if (users[usersIndex].ids.length != 0) return;

            const activeIndex = activeUsers.indexOf(users[usersIndex].userid);

            if (activeIndex === -1) return;

            users.splice(usersIndex, 1);
            activeUsers.splice(activeIndex, 1);
            io.sockets.emit("online_users", activeUsers);
        });
    });
}

await main();