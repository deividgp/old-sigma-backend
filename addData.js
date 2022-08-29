import { User } from "./models/user.js"
import { Server } from "./models/server.js"
import { UserFriends } from "./models/userfriends.js"
import { UserMessageUsers } from "./models/usermessageusers.js"
import { UserServers } from "./models/userservers.js"
import { UserChannelMessage } from "./models/userchannelmessage.js"
import { Channel } from "./models/channel.js"

export default async function addData(){
    await User.create({ username: "Deividgp", password: "hi1234", email: "hi1234@gmail.com" })
    .then(async (user1) => {
        await Server.create({ name: "Server1", description: "This is server number 1" })
        .then(async (server) => {
            await Channel.create({ ServerId: server.id, name: "hi6666666666666" });
            await UserServers.create({ UserId: user1.id, ServerId: server.id, joined: Date.now() });

            await User.create({ username: "David", password: "hi1234", email: "hi1234@gmail.com" })
            .then(async (user2) => {

                await User.create({ username: "Oriol", password: "hi1234", email: "hi1234@gmail.com" })
                .then(async (user3) => {
                    await UserFriends.create({ accepted: true, UserId: user1.id, FriendId: user3.id });
                    await UserFriends.create({ accepted: true, UserId: user3.id, FriendId: user1.id });
                    await UserServers.create({ UserId: user2.id, ServerId: server.id, joined: Date.now() });
                    await UserServers.create({ UserId: user3.id, ServerId: server.id, joined: Date.now() });

                    await Channel.create({ ServerId: server.id, name: "hi5555555555" })
                    .then(async (channel) => {
                        await UserChannelMessage.create({ content: "hahahaha", UserId: user1.id, ChannelId: channel.id });
                        await UserChannelMessage.create({ content: "hahahaha2", UserId: user2.id, ChannelId: channel.id });
                        await UserChannelMessage.create({ content: "hahahaha3", UserId: user1.id, ChannelId: channel.id });
                        await UserChannelMessage.create({ content: "hahahaha4", UserId: user3.id, ChannelId: channel.id });
                        await UserChannelMessage.create({ content: "hahahaha5", UserId: user2.id, ChannelId: channel.id });
                    });
                })
                await UserFriends.create({ accepted: false, UserId: user1.id, FriendId: user2.id });
                //await UserFriends.create({ accepted: false, UserId: user2.id, FriendId: user1.id });
            })
        })
        await Server.create({ name: "Server2", description: "This is server number 2" }).then(async (server) => {
            await UserServers.create({ UserId: user1.id, ServerId: server.id, joined: Date.now() });
        })
        await User.create({ username: "Mike", password: "hi1234", email: "hi1234@gmail.com" });
    })
    
}