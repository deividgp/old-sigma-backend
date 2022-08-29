import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import { User } from "./user.js";
import { Channel } from "./channel.js";

export const UserChannelMessage = sequelize.define(
  "UserChannelMessage",
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

/*User.belongsToMany(Channel, { through: { model: UserChannelMessage }});
Channel.belongsToMany(User, { through: { model: UserChannelMessage }});*/

User.hasMany(UserChannelMessage);
UserChannelMessage.belongsTo(User);

Channel.hasMany(UserChannelMessage);
UserChannelMessage.belongsTo(Channel);