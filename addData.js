import { User } from "./models/user.js"
import { Server } from "./models/server.js"
import { UserFriends } from "./models/userfriends.js"
import { UserMessageUsers } from "./models/usermessageusers.js"
import { UserServers } from "./models/userservers.js"
import { UserChannelMessage } from "./models/userchannelmessage.js"
import { Channel } from "./models/channel.js"

export default async function addData(){
    await User.create({ username: "Deividgp", tag: 1234, password: "hi1234", email: "hi1234@gmail.com" })
    .then(async (user1) => {
        await Server.create({ name: "Server1", description: "This is server number 1" })
        .then(async (server) => {
            await Channel.create({ ServerId: server.id, name: "hi5555555555" });
            await Channel.create({ ServerId: server.id, name: "hi6666666666666" });
            await UserServers.create({ UserId: user1.id, ServerId: server.id, joined: Date.now() });

            await User.create({ username: "David", tag: 1234, password: "hi1234", email: "hi1234@gmail.com" })
            .then(async (user2) => {
                await UserFriends.create({ accepted: true, UserId: user1.id, FriendId: user2.id });
                await UserFriends.create({ accepted: true, UserId: user2.id, FriendId: user1.id });
            })
        })
        await Server.create({ name: "Server2", description: "This is server number 2" }).then(async (server) => {
            await UserServers.create({ UserId: user1.id, ServerId: server.id, joined: Date.now() });
        })
    })
    
}