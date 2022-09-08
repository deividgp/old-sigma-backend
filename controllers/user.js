import { User } from "../models/user.js"
import { UserServers } from "../models/userservers.js"
import { UserFriends } from "../models/userfriends.js"
import faceClient from "../faceClient.js";
import { FaceClient, PersonGroupPerson } from "@azure/cognitiveservices-face";

export async function createUser(req, res) {
    const { username, password, email } = req.body;

    try {
        const userFound = await User.findOne({ where: { username: username } });
        
        if (userFound != null) {
            throw new Error("User not found");
        } else {
            const user = await User.create(
                {
                    username,
                    password,
                    email,
                    avatar: req.files[0] == undefined ? null : req.files[0].buffer
                }
            );
            const person = new PersonGroupPerson(faceClient);
            const personAux = await person.create("sigma", {
                name: user.username
            });

            person.addFaceFromStream("sigma", personAux.personId, user.avatar)
                .then(() => {
                    faceClient.personGroup.train("sigma");
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    req.login(user, () => {
                        return res.json(user);
                    });
                })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function updateUser(req, res) {
    const { id } = req.params;
    const { username, email } = req.body;

    try {
        const user = await User.findByPk(id);
        user.username = username;
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
        const user = await User.findByPk(id);
        user.active = false;
        await user.save();
        return res.sendStatus(200);
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
        return res.json(friends);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function getUserServers(req, res) {
    const { id } = req.params;

    try {
        const servers = await UserServers.findAll({
            attributes: ["ServerId"],
            where: { UserId: id },
        });

        return res.json(servers);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function joinServer(req, res) {
    const { id } = req.params;
    const { serverId } = req.body;

    try {
        const user = await UserServers.create(
            {
                UserId: id,
                ServerId: serverId,
                joined: Date.now()
            }
        );

        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function leaveServer(req, res) {
    const { id } = req.params;
    const { serverId } = req.body;

    try {
        await UserServers.destroy({
            where: {
                ServerId: serverId,
                UserId: id
            },
        });
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function addFriend(req, res) {
    const { id } = req.params;
    const { userId } = req.body;

    try {
        const friend = await UserFriends.create(
            {
                UserId: id,
                FriendId: userId,
                accepted: false
            }
        );
        return res.json(friend);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function deleteFriend(req, res) {
    const { id } = req.params;
    const { userId } = req.body;

    try {
        await UserServers.destroy({
            where: {
                UserId: id,
                FriendId: userId
            },
        });

        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function acceptFriend(req, res) {
    const { id } = req.params;
    const { userId } = req.body;

    try {
        const friend = await User.findOne({ where: { UserId: userId, FriendId: id } });
        friend.accepted = true;
        await friend.save();
        await UserFriends.create(
            {
                UserId: id,
                FriendId: userId,
                accepted: true
            }
        );
        return res.json(friend);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}