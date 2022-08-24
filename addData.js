import { User } from "./models/user.js"
import { Server } from "./models/server.js"
import { UserFriends } from "./models/userfriends.js"
import { UserMessageUsers } from "./models/usermessageusers.js"
import { UserServers } from "./models/userservers.js"
import { UserChannelMessage } from "./models/userchannelmessage.js"
import { Channel } from "./models/channel.js"

export default async function addData(){
    await User.create({ username: "Deividgp", tag: 1234, password: "hi1234", email: "hi1234@gmail.com" })
    .then(async (user) => {
        await Server.create({ name: "Server1" }).then(async (server) => {
            await UserServers.create({ UserId: user.id, ServerId: server.id, joined: Date.now() });
        })
        await Server.create({ name: "Server2" }).then(async (server) => {
            await UserServers.create({ UserId: user.id, ServerId: server.id, joined: Date.now() });
        })
    })
    await User.create({ username: "David", tag: 1234, password: "hi1234", email: "hi1234@gmail.com" })
}