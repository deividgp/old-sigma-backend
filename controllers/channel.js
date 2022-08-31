import { UserChannelMessage } from "../models/userchannelmessage.js"
import { Channel } from "../models/channel.js"
import { User } from "../models/user.js"
import uuid from "uuid4"

export async function createChannel(req, res) {
    const { name, serverId } = req.body;

    await Channel.create(
        {
            name,
            ServerId: serverId
        }
    )
        .then((channel) => {
            return res.json(channel);
        })
        .catch((error) => {
            return res.status(500).json({ message: error.message });
        });
}

export async function updateChannel(req, res) {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const channel = await Channel.findByPk(id);
        channel.name = name;
        await channel.save();

        res.json(channel);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function deleteChannel(req, res) {
    const { id } = req.params;

    await Channel.destroy({
        where: {
            id
        },
    })
        .then(() => {
            return res.sendStatus(200);
        })
        .catch((error) => {
            return res.status(500).json({ message: error.message });
        });
}

export async function getChannelMessages(req, res) {
    const { id } = req.params;

    await Channel.findOne({
        where: { id: id },
        include: {
            model: UserChannelMessage,
            include: {
                model: User,
                attributes: ["id", "username"]
            }
        }
    })
        .then((channel) => {
            return res.json(channel.UserChannelMessages);
        })
        .catch((error) => {
            return res.status(500).json({ message: error.message });
        });
}