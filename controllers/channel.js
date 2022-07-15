import { UserChannelMessage } from "./models/userchannelmessage.js"
import { Channel } from "./models/channel.js"
import uuid from "uuid4"

export async function createChannel(req, res) {
    const { name, serverId } = req.body;

    try {
        let newChannel = await User.create(
            {
                name, serverId
            },
            {
                fields: ["name", "serverId"],
            }
        );
        return res.json(newChannel);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
    res.json("received");
}

export async function updateChannel(req, res) {
    try {
        const { id } = req.params;
        const { name } = req.body;
    
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

    try {
        const messages = await UserChannelMessage.findAll({
            where: {
                ChannelId: id,
            },
        });
        messages.forEach(async (message) => {
            message.UserId = uuid.empty();
            await message.save();
        });
        await Channel.destroy({
            where: {
                id,
            },
        });
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function getChannelMessages(req, res){
    const { id } = req.params;

    try {
        const messages = await UserChannelMessage.findAll({
            attributes: ["id", "content", "UserId"],
            where: { ChannelId: id },
        });
        res.json(messages);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}