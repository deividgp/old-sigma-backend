import { User } from "./models/user.js"
import { Server } from "./models/server.js"
import { UserFriends } from "./models/userfriends.js"
import { UserUserMessages } from "./models/userusermessages.js"
import { UserServers } from "./models/userservers.js"
import { UserChannelMessage } from "./models/userchannelmessage.js"
import { Channel } from "./models/channel.js"

export default async function addData() {
    await User.create({ username: "Deividgp", password: "hi1234", email: "hi1234@gmail.com" })
        .then(async (user1) => {
            await Server.create({ name: "Server1", description: "This is server number 1", OwnerId: user1.id })
                .then(async (server) => {
                    await Channel.create({ ServerId: server.id, name: "Channel2" });
                    await UserServers.create({ UserId: user1.id, ServerId: server.id, joined: Date.now() });

                    await User.create({ username: "David", password: "hi1234", email: "hi1234@gmail.com" })
                        .then(async (user2) => {

                            await User.create({ username: "Oriol", password: "hi1234", email: "hi1234@gmail.com" })
                                .then(async (user3) => {
                                    await UserFriends.create({ accepted: true, UserId: user1.id, FriendId: user3.id });
                                    await UserFriends.create({ accepted: true, UserId: user3.id, FriendId: user1.id });
                                    await UserServers.create({ UserId: user2.id, ServerId: server.id, joined: Date.now() });
                                    await UserServers.create({ UserId: user3.id, ServerId: server.id, joined: Date.now() });

                                    await Channel.create({ ServerId: server.id, name: "Channel2" })
                                        .then(async (channel) => {
                                            await UserChannelMessage.create({ content: "hi", UserId: user1.id, ChannelId: channel.id });
                                            await UserChannelMessage.create({ content: "hi users", UserId: user2.id, ChannelId: channel.id });
                                            await UserChannelMessage.create({ content: "hi everyone", UserId: user1.id, ChannelId: channel.id });
                                            await UserChannelMessage.create({ content: "hello there", UserId: user3.id, ChannelId: channel.id });
                                            await UserChannelMessage.create({ content: "hihi", UserId: user2.id, ChannelId: channel.id });
                                        });
                                    await UserUserMessages.create({ content: "hi", UserId: user1.id, MessageUserId: user3.id });
                                    await UserUserMessages.create({ content: "hi users", UserId: user3.id, MessageUserId: user1.id });
                                    await UserUserMessages.create({ content: "hi everyone", UserId: user1.id, MessageUserId: user3.id });
                                    await UserUserMessages.create({ content: "hello there", UserId: user3.id, MessageUserId: user1.id });
                                    await UserUserMessages.create({ content: "hihi", UserId: user1.id, MessageUserId: user3.id });
                                    await UserUserMessages.create({ content: "hihi", UserId: user3.id, MessageUserId: user1.id });
                                })
                            await UserFriends.create({ accepted: false, UserId: user1.id, FriendId: user2.id });
                            //await UserFriends.create({ accepted: false, UserId: user2.id, FriendId: user1.id });
                        })
                })
            await Server.create({ name: "Server2", description: "This is server number 2", OwnerId: user1.id }).then(async (server) => {
                await UserServers.create({ UserId: user1.id, ServerId: server.id, joined: Date.now() });
            })
            await User.create({ username: "Mike", password: "hi1234", email: "hi1234@gmail.com" });
        })

}