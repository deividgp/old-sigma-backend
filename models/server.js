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
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  { timestamps: false }
);

Server.hasMany(Channel);
Channel.belongsTo(Server);