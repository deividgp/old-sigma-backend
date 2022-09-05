import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import { User } from "./user.js";

export const UserUserMessages = sequelize.define(
  "UserUserMessages",
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

User.hasMany(UserUserMessages);
UserUserMessages.belongsTo(User, {
  as: "MessageUser"
});

User.hasMany(UserUserMessages);
UserUserMessages.belongsTo(User);

//User.belongsToMany(User, { as: "MessageUsers", through: { model: UserUserMessage }});