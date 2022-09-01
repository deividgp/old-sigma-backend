import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import { User } from "./user.js";
import { Server } from "./server.js";

export const UserServers = sequelize.define(
    "UserServers",
    {
        joined: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.fn('now')
        }
    },
    { timestamps: false }
);

User.belongsToMany(Server, { through: UserServers });
Server.belongsToMany(User, { through: UserServers });