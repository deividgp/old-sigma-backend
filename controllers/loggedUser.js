import { User } from "../models/user.js"
import { Channel } from "../models/channel.js"
import { UserServers } from "../models/userservers.js"
import { UserFriends } from "../models/userfriends.js"
import { UserUserMessages } from "../models/userusermessages.js"
import { Server } from "../models/server.js"
import { Op } from "sequelize"

export async function getFriends(req, res) {
    try {
        const user = await User.findByPk(req.user.id, {
            include: {
                model: User,
                attributes: ["id", "username"],
                as: "Friends",
                through: {
                    where: {
                        accepted: true
                    }
                }
            }
        });
        return res.json(user.Friends);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function getPendingFriends(req, res) {

    try {
        const user = await User.findByPk(req.user.id, {
            include: {
                model: User,
                attributes: ["id", "username"],
                as: "Friends",
                through: {
                    where: {
                        accepted: false
                    }
                }
            }
        });

        return res.json(user.Friends);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function addFriend(req, res) {
    const { username } = req.body;

    try {
        const user = await User.findOne({
            where: {
                username: username
            },
            attributes: ['id']
        });
        const userFriend = await UserFriends.findOne({
            where: {
                [Op.or]: [
                    {
                        UserId: req.user.id,
                        FriendId: user.id
                    },
                    {
                        UserId: user.id,
                        FriendId: req.user.id
                    }
                ]
            }
        });

        if (userFriend !== null) throw new Error("Relation already exists");

        await UserFriends.create(
            {
                UserId: user.id,
                FriendId: req.user.id,
                accepted: false
            }
        )

        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function acceptFriend(req, res) {
    const { userId } = req.body;

    try {
        const friend = await UserFriends.findOne({ where: { UserId: req.user.id, FriendId: userId } });
        friend.accepted = true;
        await friend.save();
        await UserFriends.create(
            {
                UserId: userId,
                FriendId: req.user.id,
                accepted: true
            }
        );
        const user = await User.findByPk(userId, {
            attributes: ["id", "username"]
        });
        return res.json(user);
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
        });

        return res.sendStatus(200);
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
        });
        await UserFriends.destroy({
            where: {
                FriendId: req.user.id,
                UserId: id
            },
        });
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function getServers(req, res) {

    try {
        const user = await User.findByPk(req.user.id, {
            include: {
                model: Server,
                include: {
                    model: Channel
                }
            }
        });

        return res.json(user.Servers);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function joinServer(req, res) {
    const { name } = req.body;

    try {
        const server = await Server.findOne({
            where: {
                name
            }
        });

        if (server == null) {
            const createdServer = await Server.create(
                {
                    name,
                    OwnerId: req.user.id
                }
            );

            await UserServers.create(
                {
                    UserId: req.user.id,
                    ServerId: createdServer.id,
                    joined: Date.now()
                }
            )
            return res.json(createdServer.id);
        } else {
            await UserServers.create(
                {
                    UserId: req.user.id,
                    ServerId: server.id,
                    joined: Date.now()
                }
            )
            return res.json(server.id);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function leaveServer(req, res) {
    const { id } = req.params;

    try {
        await UserServers.destroy({
            where: {
                ServerId: id,
                UserId: req.user.id
            },
        });
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function getUserMessages(req, res) {
    const { id } = req.params;

    try {
        const messages = await UserUserMessages.findAll({
            where: {
                [Op.or]: [
                    {
                        UserId: req.user.id,
                        MessageUserId: id
                    },
                    {
                        UserId: id,
                        MessageUserId: req.user.id
                    }
                ]
            },
            include: {
                model: User,
                attributes: ["id", "username"]
            }
        });
        return res.json(messages);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}