import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app.js";

const origin = process.env.ORIGIN || "http://localhost:3000";
const port = process.env.PORT || 4000;
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: origin,
        credentials: true
    }
});

server.listen(port, () => {
    try {
        console.log('Connected')
    }
    catch (error) {
        console.error(`Cannot connect ${error}`)
    }
});

export default io;