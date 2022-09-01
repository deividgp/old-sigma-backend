import Sequelize from "sequelize";
import dotenv from "dotenv"
dotenv.config()

const sequelize = new Sequelize(process.env.CONNECTION_STRING)

export default sequelize;