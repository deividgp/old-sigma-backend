import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { User } from "./user.js";

export const Configuration = sequelize.define(
  "Configuration",
  {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    }
  }
);

Configuration.hasOne(User, {
    foreignkey: "configurationId",
    sourceKey: "id",
});
User.belongsTo(Configuration, { foreinkey: "configurationId", targetId: "Id" });