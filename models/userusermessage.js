import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import { User } from "./user.js";

export const UserUserMessage = sequelize.define(
  "UserUserMessage",
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
    },
    created: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('now')
  }
  },
  { timestamps: false }
);

//User.belongsToMany(User, { as: "MessageUsers", through: { model: UserUserMessage }});
User.hasMany(UserUserMessage);
UserUserMessage.belongsTo(User, {
  as: "MessageUser"
});

User.hasMany(UserUserMessage);
UserUserMessage.belongsTo(User);