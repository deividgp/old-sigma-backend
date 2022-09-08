import { FaceClient, FaceModels } from "@azure/cognitiveservices-face";
import { CognitiveServicesCredentials } from "@azure/ms-rest-azure-js";
import dotenv from "dotenv"
dotenv.config()

const faceClient = new FaceClient(new CognitiveServicesCredentials(process.env.SUBSCRIPTION_KEY), process.env.ENDPOINT);

export default faceClient;