import { User } from "../models/user.js"
import { Channel } from "../models/channel.js"
import { UserServers } from "../models/userservers.js"
import { UserFriends } from "../models/userfriends.js"
import { UserMessageUsers } from "../models/usermessageusers.js"
import { Server } from "../models/server.js"

export async function getFriends(req, res) {
    try {
        await User.findOne({
            where: {
                id: req.user.id
            },
            include: {
                model: User,
                attributes: ["id","username"],
                as: "Friends",
                through: {
                    where: {
                      accepted: true
                    }
                }
            }
        })
        .then((user) => {
            res.json(user.Friends);
        });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export async function getPendingFriends(req, res) {
    try {
        await User.findOne({
            where: {
                id: req.user.id
            },
            include: {
                model: User,
                attributes: ["id","username"],
                as: "Friends",
                through: {
                    where: {
                      accepted: false
                    }
                }
            }
        })
        .then((user) => {
            res.json(user.Friends);
        });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export async function addFriend(req, res) {
    const { username } = req.body;

    try {
        User.findOne({
            where: {
                username: username
            },
            attributes: ['id']
        })
        .then(async (user) => {

            await UserFriends.create(
                {
                    UserId: user.id,
                    FriendId: req.user.id,
                    accepted: false
                }
            )
            .then((friend) => {
                res.json(friend);
            })
            .catch((error) => {
                return res.status(500);
            });
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function acceptFriend(req, res) {
    const { userId } = req.body;

    try {
        await UserFriends.findOne({ where: { UserId: req.user.id, FriendId: userId } })
        .then(async (friend) => {
            friend.accepted = true;
            await friend.save();
            await UserFriends.create(
                {
                    UserId: userId,
                    FriendId: req.user.id,
                    accepted: true
                }
            )
            .then(async () => {
                await User.findByPk(userId)
                .then((user) => {
                    res.json(user);
                });
            });
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function ignoreFriend(req, res) {
    const { id } = req.params;

    try {
        await UserFriends.destroy({
            where: {
                UserId: req.user.id,
                FriendId: id
            },
        })
        .then(() => {
            res.sendStatus(204);
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function deleteFriend(req, res) {
    const { id } = req.params;

    try {
        await UserFriends.destroy({
            where: {
                UserId: req.user.id,
                FriendId: id
            },
        })
        .then(async () => {
            await UserFriends.destroy({
                where: {
                    FriendId: req.user.id,
                    UserId: id
                },
            })
            .then(() => {
                res.sendStatus(204);
            });
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function getServers(req, res) {
    try {
        await User.findOne({
            where: { id: req.user.id },
            include: {
                model: Server,
                include: {
                  model: Channel
                }
            }
        })
        .then((user) => {
            res.json(user.Servers);
        });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export async function joinServer(req, res) {
    const { serverId } = req.body;

    try {
        await UserServers.create(
            {
                UserId: req.user.id,
                ServerId: serverId,
                joined: Date.now()
            }
        ).then((user) => {
            res.json(user);
        });
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
        })
        .then(() => {
            res.sendStatus(204);
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}