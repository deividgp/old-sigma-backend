import { User } from "./models/user.js"
import { UserChannelMessage } from "./models/userchannelmessage.js"
import { UserServers } from "./models/userservers.js"
import { UserFriends } from "./models/userfriends.js"
import { UserMessageUsers } from "./models/usermessageusers.js"

export async function createUser(req, res) {
    const { username, password, email } = req.body;
    let tag;
    let auxUser;

    do {
        tag = Math.floor(Math.random() * max);
        auxUser = await User.findOne({ where: { username: username, tag: tag } });
    } while (auxUser != null);

    try {
        let newUser = await User.create(
            {
                username,
                password,
                email,
                tag,
            },
            {
                fields: ["username", "password", "email", "tag"],
            }
        );
        return res.json(newUser);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
    res.json("received");
}

export async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const { username, tag, email } = req.body;
    
        const user = await User.findByPk(id);
        user.username = username;
        user.tag = tag;
        user.email = email;
        await user.save();
    
        res.json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function deleteUser(req, res) {
    const { id } = req.params;

    try {
        await UserFriends.destroy({
            where: {
                [Op.or]: [
                    { UserId: id },
                    { FriendId: id }
                ]
            },
        });
        await UserServers.destroy({
            where: {
                UserId: id,
            },
        });
        await User.destroy({
            where: {
                id,
            },
        });
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function getUserFriends(req, res) {
    const { id } = req.params;

    try {
        const friends = await UserFriends.findAll({
            attributes: ["FriendId"],
            where: { UserId: id },
        });
        res.json(friends);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

export async function getUserServers(req, res) {
    const { id } = req.params;

    try {
        const servers = await UserServers.findAll({
            attributes: ["ServerId"],
            where: { UserId: id },
        });
        res.json(servers);
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}