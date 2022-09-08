import { User } from "./models/user.js";
import faceClient from "./faceClient.js";
import { Op } from "sequelize"
import { Face } from "@azure/cognitiveservices-face";

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

async function DetectFaceRecognize(file){
    const sufficientQualityFaces = [];
    const face = new Face(faceClient);
    face.detectWithStream(file, {
        recognitionModel: "recognition_04",
        detectionModel: "detection_03",
        returnFaceAttributes: "qualityForRecognition"
    })
    .then(faces => {
        faces.forEach(face => {
            const quality = face.faceAttributes.qualityForRecognition;
            if(quality == "Medium" || quality == "High"){
                sufficientQualityFaces.push(face);
            }
        });
    })
}

async function FindSimilar(file){
    const faces = DetectFaceRecognize(file);
    const face = new Face(faceClient);
    const results = face.identify
}