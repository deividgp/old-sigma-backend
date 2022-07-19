import { User } from "./models/user.js"
import { Server } from "./models/server.js"
import { UserFriends } from "./models/userfriends.js"
import { UserMessageUsers } from "./models/usermessageusers.js"
import { UserServers } from "./models/userservers.js"
import { UserChannelMessage } from "./models/userchannelmessage.js"
import { Channel } from "./models/channel.js"

export default async function addData(){
    addUsers();
    addServers();
    addChannels();
    addUserMessages();
    addChannelMessages();
    addUserFriends();
    addUserServers();
}

async function addUsers(){
    await User.create({ username: "Deividgp", tag: 1234, password: "hi1234", email: "hi1234@gmail.com" })
    await User.create({ username: "David", tag: 1234, password: "hi1234", email: "hi1234@gmail.com" })
}

async function addServers(){
    await Server.create({ name: "Server1" })
    await Server.create({ name: "Server2" })
}

async function addChannels(){

}

async function addUserMessages(){
    
}

async function addChannelMessages(){

}

async function addUserFriends(){

}

async function addUserServers(){

}