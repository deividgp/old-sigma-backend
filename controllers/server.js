import { UserServers } from "../models/userservers.js"
import { Server } from "../models/server.js"
import { Channel } from "../models/channel.js"
import { User } from "../models/user.js"

export async function createServer(req, res) {
    const { name, description, OwnerId } = req.body;

    try {
        const server = await Server.create(
            {
                name,
                description,
                OwnerId
            }
        );

        return res.json(server);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function updateServer(req, res) {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const server = await Server.findByPk(id);
        server.name = name;
        await server.save();
        return res.json(server);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function deleteServer(req, res) {
    const { id } = req.params;

    try {
        await Channel.destroy({
            where: {
                ServerId: id,
            },
        });

        await Server.destroy({
            where: {
                id,
            },
        });

        await UserServers.destroy({
            where: {
                ServerId: id,
            },
        });
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function getServerChannels(req, res) {
    const { id } = req.params;

    try {
        const channels = await Channel.findAll({
            attributes: ["id", "name"],
            where: { serverId: id },
        });

        return res.json(channels);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function getServerUsers(req, res) {
    const { id } = req.params;

    try {
        const server = await Server.findByPk(id, {
            include: {
                model: User,
                attributes: ["id", "username"]
            }
        });

        res.json(server.Users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function addUserServer(req, res) {
    const { id } = req.params;
    const { userId } = req.body;

    try {
        const userserver = await UserServers.create(
            {
                ServerId: id,
                UserId: userId,
                joined: Date.now()
            }
        );

        return res.json(userserver);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function deleteUserServer(req, res) {
    const { id, userId } = req.params;

    try {
        await UserServers.destroy({
            where: {
                ServerId: id,
                UserId: userId
            },
        });

        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}