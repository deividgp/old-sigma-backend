import { User } from "./models/user.js";
import faceClient from "./recognition.js";
import { Op } from "sequelize"

export default async function recognition() {
    faceClient.personGroup.deleteMethod("sigma")
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            faceClient.personGroup.create("sigma", "Sigma", {
                recognitionModel: "recognition_04"
            })
                .then(() => {
                    User.findAll({
                        avatar: {
                            [Op.ne]: null
                        },
                        attributes: ["username", "avatar"]
                    })
                        .then((users) => {
                            users.forEach(user => {
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
                                });
                            });
                        })
                })
                .catch(() => {
                    console.log("Unable to create person group");
                })
        })
}