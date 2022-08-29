import { DataTypes } from "sequelize";
import sequelize from "../database.js";
import { Server } from "./server.js";
import bcrypt from "bcryptjs";

export const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "User"
        },
        profilePicture: {
            type: DataTypes.STRING,
            allowNull: true
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
    },
    { timestamps: false }
);

User.beforeCreate(async (user) => {
    user.password = await user.generatePasswordHash();
});

User.prototype.generatePasswordHash = function () {
    if (this.password) {
        return bcrypt.hash(this.password, 10);
    }
};

User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

Server.belongsTo(User, {
    foreignKey: "ownerId",
    as: "owner"
});
User.hasMany(Server, { as: "ownedServers", foreignKey: "ownerId" });
