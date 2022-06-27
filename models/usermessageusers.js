import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { User } from "./user.js";

export const UserMessageUsers = sequelize.define(
  "UserMessageUsers",
  {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: false
    }
  }
);

User.belongsToMany(User, { as: "MessageUsers", through: UserMessageUsers });