import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Server = sequelize.define(
  "Server",
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