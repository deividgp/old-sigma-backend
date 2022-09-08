import { User } from "../models/user.js"
import { UserServers } from "../models/userservers.js"
import { UserFriends } from "../models/userfriends.js"
import faceClient from "../faceClient.js";
import { FaceClient, PersonGroupPerson } from "@azure/cognitiveservices-face";

export async function createUser(req, res) {
    const { username, password, email } = req.body;

    await User.findOne({ where: { username: username } })
        .then(async (userFound) => {
            if (userFound != null) {
                return res.sendStatus(500);
            } else {
                await User.create(
                    {
                        username,
                        password,
                        email,
                        avatar: req.files[0].buffer
                    }
                )
                    .then((user) => {
                        const person = new PersonGroupPerson(faceClient); 
                        person.create("sigma", {
                            name: user.username
                        }).then((personAux) => {
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
                        });
                    })
            }
        })
        .catch(() => {
            return res.sendStatus(500);
        });
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

    await UserFriends.findAll({
        attributes: ["FriendId"],
        where: { UserId: id },
    })
        .then((friends) => {
            return res.json(friends);
        })
        .catch((error) => {
            return res.status(500).json({ message: error.message });
        });
}

export async function getUserServers(req, res) {
    const { id } = req.params;

    await UserServers.findAll({
        attributes: ["ServerId"],
        where: { UserId: id },
    })
        .then((servers) => {
            return res.json(servers);
        })
        .catch((error) => {
            return res.status(500).json({ message: error.message });
        });
}

export async function joinServer(req, res) {
    const { id } = req.params;
    const { serverId } = req.body;

    await UserServers.create(
        {
            UserId: id,
            ServerId: serverId,
            joined: Date.now()
        }
    )
        .then((user) => {
            return res.json(user);
        })
        .catch((error) => {
            return res.status(500).json({ message: error.message });
        });
}

export async function leaveServer(req, res) {
    const { id } = req.params;
    const { serverId } = req.body;

    await UserServers.destroy({
        where: {
            ServerId: serverId,
            UserId: id
        },
    })
        .then(() => {
            return res.sendStatus(200);
        })
        .catch((error) => {
            return res.status(500).json({ message: error.message });
        });
}

export async function addFriend(req, res) {
    const { id } = req.params;
    const { userId } = req.body;

    await UserFriends.create(
        {
            UserId: id,
            FriendId: userId,
            accepted: false
        }
    )
        .then((friend) => {
            return res.json(friend);
        })
        .catch((error) => {
            return res.status(500).json({ message: error.message });
        });
}

export async function deleteFriend(req, res) {
    const { id } = req.params;
    const { userId } = req.body;

    await UserServers.destroy({
        where: {
            UserId: id,
            FriendId: userId
        },
    })
        .then(() => {
            return res.sendStatus(200);
        })
        .catch((error) => {
            return res.status(500).json({ message: error.message });
        });
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
        res.json(friend);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}