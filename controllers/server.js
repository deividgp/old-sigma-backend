import { UserServers } from "../models/userservers.js"
import { Server } from "../models/server.js"
import { Channel } from "../models/channel.js"
import { User } from "../models/user.js"

export async function createServer(req, res) {
    const { name, description, OwnerId } = req.body;

    await Server.create(
        {
            name,
            description,
            OwnerId
        }
    )
        .then((server) => {
            return res.json(server);
        })
        .catch((error) => {
            return res.status(500).json({ message: error.message });
        });
}

export async function updateServer(req, res) {
    const { id } = req.params;
    const { name } = req.body;

    await Server.findByPk(id)
        .then(async (server) => {
            server.name = name;
            await server.save();
            return res.json(server);
        })
        .catch((error) => {
            return res.status(500).json({ message: error.message });
        });
}

export async function deleteServer(req, res) {
    const { id } = req.params;

    await Channel.destroy({
        where: {
            ServerId: id,
        },
    })
        .then(async () => {
            await Server.destroy({
                where: {
                    id,
                },
            })
                .then(async () => {
                    await UserServers.destroy({
                        where: {
                            ServerId: id,
                        },
                    });
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

export async function getServerChannels(req, res) {
    const { id } = req.params;

    await Channel.findAll({
        attributes: ["id", "name"],
        where: { serverId: id },
    })
        .then((channels) => {
            return res.json(channels);
        })
        .catch((error) => {
            return res.status(500).json({ message: error.message });
        });
}

export async function getServerUsers(req, res) {
    const { id } = req.params;

    await Server.findByPk(id, {
        include: {
            model: User,
            attributes: ["id", "username"]
        }
    })
        .then((server) => {
            res.json(server.Users);
        })
        .catch((error) => {
            return res.status(500).json({ message: error.message });
        });
}

export async function addUserServer(req, res) {
    const { id } = req.params;
    const { userId } = req.body;

    await UserServers.create(
        {
            ServerId: id,
            UserId: userId,
            joined: Date.now()
        }
    )
        .then((userserver) => {
            return res.json(userserver);
        })
        .catch((error) => {
            return res.status(500).json({ message: error.message });
        });
}

export async function deleteUserServer(req, res) {
    const { id, userId } = req.params;

    await UserServers.destroy({
        where: {
            ServerId: id,
            UserId: userId
        },
    })
        .then(() => {
            return res.sendStatus(200);
        })
        .catch((error) => {
            return res.status(500).json({ message: error.message });
        });
}