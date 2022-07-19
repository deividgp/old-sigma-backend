import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import { User } from "./user.js";

export const UserFriends = sequelize.define(
  "UserFriends",
  {
    accepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }
);

User.belongsToMany(User, { as: "Friends", through: UserFriends });