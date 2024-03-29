import { User } from "./models/user.js";
import faceClient from "./faceClient.js";
import { Op } from "sequelize"
import { Face, PersonGroupPerson } from "@azure/cognitiveservices-face";

export async function createPersonGroup() {
    faceClient.personGroup.deleteMethod("sigma")
        .catch((error) => {
            console.log(error);
        })
        .finally(async () => {

            try {
                await faceClient.personGroup.create("sigma", "Sigma", {
                    recognitionModel: "recognition_04"
                });
                const users = await User.findAll({
                    where: {
                        avatar: {
                            [Op.ne]: null
                        },
                    },
                    attributes: ["username", "avatar"]
                });

                users.forEach(async user => {
                    try {
                        const person = new PersonGroupPerson(faceClient);
                        const personAux = await person.create("sigma", {
                            name: user.username
                        });
                        await person.addFaceFromStream("sigma", personAux.personId, user.avatar);
                        await faceClient.personGroup.train("sigma");
                    } catch (error) {
                        console.log(error);
                    }
                });
            } catch (error) {
                console.log(error);
            }
        })
}

export const FindSimilar = (file) => {
    return new Promise(async (resolve, reject) => {

        try {
            const face = new Face(faceClient);
            const faces = await face.detectWithStream(file, {
                recognitionModel: "recognition_04",
                detectionModel: "detection_03"
            });
            const results = await face.identify(faces.map(auxFace => auxFace.faceId), {
                personGroupId: "sigma"
            });
            const group = new PersonGroupPerson(faceClient);
            const person = await group.get("sigma", results[0].candidates[0].personId);
            resolve(person.name);
        } catch (error) {
            console.log(error);
        }
    });
}