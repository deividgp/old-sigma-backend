import { DataTypes } from "sequelize";
import sequelize from "../database.js";

export const Channel = sequelize.define(
    "Channel",
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
);

