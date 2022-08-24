import { User } from "../models/user.js"
import { Channel } from "../models/channel.js"
import { UserServers } from "../models/userservers.js"
import { UserFriends } from "../models/userfriends.js"
import { UserMessageUsers } from "../models/usermessageusers.js"
import { Server } from "../models/server.js"

export async function getFriends(req, res) {
    try {
        const friends = await UserFriends.findAll({
            attributes: ["FriendId"],
            where: { UserId: req.user.id },
        });
        res.json(friends);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export async function getServers(req, res) {
    try {
        /*await UserServers.findAll({
            where: { UserId: req.user.id },
        })
        .then((servers) => {
            servers.forEach(async (server) => {
                console.log(server);
                await Channel.findAll({
                    attributes: ["id", "name"],
                    where: { ServerId: server.ServerId }
                }).then((channels) => {
                    servers.channels = channels;
                })
            });
            res.json(servers);
            /*await Channel.findAll({
                attributes: ["name"],
                where: { ServerId: req.user.id },
            })
        })*/
        await User.findAll({
            include: Server,
            where: { id: req.user.id }
        })
        .then((result) => {
            console.log(result);
            res.json("hola");
        });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export async function joinServer(req, res) {
    const { serverId } = req.body;

    try {
        let newUserServer = await UserServers.create(
            {
                UserId: req.user.id,
                ServerId: serverId,
                joined: Date.now()
            }
        );
        return res.json(newUserServer);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
    res.json("received");
}

export async function leaveServer(req, res) {
    const { serverId } = req.body;

    try {
        await UserServers.destroy({
            where: {
                ServerId: serverId,
                UserId: req.user.id
            },
        });
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function addFriend(req, res) {
    const { userId } = req.body;

    try {
        let newFriend = await UserFriends.create(
            {
                UserId: req.user.id,
                FriendId: userId,
                accepted: false
            }
        );
        return res.json(newFriend);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function deleteFriend(req, res) {
    const { userId } = req.body;

    try {
        await UserServers.destroy({
            where: {
                UserId: req.user.id,
                FriendId: userId
            },
        });
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function acceptFriend(req, res) {
    const { userId } = req.body;
    
    try {
        const friend = await User.findOne({ where: { UserId: userId, FriendId: id } });
        friend.accepted = true;
        await friend.save();
        await UserFriends.create(
            {
                UserId: req.user.id,
                FriendId: userId,
                accepted: true
            }
        );
        res.json(friend);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}