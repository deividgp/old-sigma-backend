import { User } from "../models/user.js"
import { Channel } from "../models/channel.js"
import { UserServers } from "../models/userservers.js"
import { UserFriends } from "../models/userfriends.js"
import { UserUserMessages } from "../models/userusermessages.js"
import { Server } from "../models/server.js"
import { Op } from "sequelize"

export async function getFriends(req, res) {
    await User.findByPk(req.user.id, {
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
    })
        .then((user) => {
            res.json(user.Friends);
        })
        .catch((error) => {
            return res.status(500).json({ message: error.message });
        });
}

export async function getPendingFriends(req, res) {
    await User.findByPk(req.user.id, {
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
    })
        .then((user) => {
            res.json(user.Friends);
        })
        .catch((error) => {
            return res.status(500).json({ message: error.message });
        });
}

export async function addFriend(req, res) {
    const { username } = req.body;

    User.findOne({
        where: {
            username: username
        },
        attributes: ['id']
    })
        .then(async (user) => {
            await UserFriends.findOne({
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
            })
                .then(async (userfriend) => {
                    if (userfriend !== null) throw new Error("Relation already exists");

                    await UserFriends.create(
                        {
                            UserId: user.id,
                            FriendId: req.user.id,
                            accepted: false
                        }
                    )
                        .then(() => {
                            return res.json(user);
                        })
                        .catch((error) => {
                            return res.status(500).json({ message: error.message });
                        });
                })
                .catch((error) => {
                    return res.status(500).json({ message: error.message });
                });
        })
        .catch((error) => {
            return res.status(500).json({ message: error.message });
        });
}

export async function acceptFriend(req, res) {
    const { userId } = req.body;

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
                    await User.findByPk(userId, {
                        attributes: ["id", "username"]
                    })
                        .then((user) => {
                            return res.json(user);
                        });
                })
                .catch((error) => {
                    return res.status(500).json({ message: error.message });
                });
        })
        .catch((error) => {
            return res.status(500).json({ message: error.message });
        });
}

export async function ignoreFriend(req, res) {
    const { id } = req.params;

    await UserFriends.destroy({
        where: {
            UserId: req.user.id,
            FriendId: id
        },
    })
        .then(() => {
            res.sendStatus(200);
        })
        .catch((error) => {
            return res.status(500).json({ message: error.message });
        });
}

export async function deleteFriend(req, res) {
    const { id } = req.params;

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
                    return res.sendStatus(200);
                })
                .catch((error) => {
                    return res.status(500).json({ message: error.message });
                });
        })
        .catch((error) => {
            return res.status(500).json({ message: error.message });
        });
}

export async function getServers(req, res) {
    await User.findByPk(req.user.id, {
        include: {
            model: Server,
            include: {
                model: Channel
            }
        }
    })
        .then((user) => {
            return res.json(user.Servers);
        })
        .catch((error) => {
            return res.status(500).json({ message: error.message });
        });
}

export async function joinServer(req, res) {
    const { name } = req.body;

    await Server.findOne({
        where: {
            name
        }
    })
        .then(async (server) => {
            if (server == null) {
                await Server.create(
                    {
                        name,
                        OwnerId: req.user.id
                    }
                )
                    .then(async (createdServer) => {
                        await UserServers.create(
                            {
                                UserId: req.user.id,
                                ServerId: createdServer.id,
                                joined: Date.now()
                            }
                        )
                            .then(() => {
                                return res.json(createdServer.id);
                            })
                            .catch((error) => {
                                return res.status(500).json({ message: error.message });
                            });
                    })
                    .catch((error) => {
                        return res.status(500).json({ message: error.message });
                    });
            } else {
                await UserServers.create(
                    {
                        UserId: req.user.id,
                        ServerId: server.id,
                        joined: Date.now()
                    }
                )
                    .then(() => {
                        return res.json(server.id);
                    })
                    .catch((error) => {
                        return res.status(500).json({ message: error.message });
                    });
            }
        })
        .catch((error) => {
            return res.status(500).json({ message: error.message });
        });
}

export async function leaveServer(req, res) {
    const { id } = req.params;

    await UserServers.destroy({
        where: {
            ServerId: id,
            UserId: req.user.id
        },
    })
        .then(() => {
            return res.sendStatus(200);
        })
        .catch((error) => {
            return res.status(500).json({ message: error.message });
        });
}

export async function getUserMessages(req, res) {
    const { id } = req.params;

    await UserUserMessages.findAll({
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
    })
        .then((messages) => {
            return res.json(messages);
        })
        .catch((error) => {
            return res.status(500).json({ message: error.message });
        });
}