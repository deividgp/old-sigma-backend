import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import { Channel } from "./channel.js";

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
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  { timestamps: false }
);

Server.hasMany(Channel, {
  foreignkey: "serverId",
  sourceKey: "id",
});
Channel.belongsTo(Server, { foreignkey: "serverId", targetId: "id" });