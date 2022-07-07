import { DataTypes } from "sequelize";
import { sequelize } from "../database.js";
import { Server } from "./server.js";

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
        allowNull: false
    },
    tag: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: true
    }
  },
  {
    defaultScope: {
      rawAttributes: { exclude: ['password'] },
    },
  },
);

User.beforeCreate(async (user) => {
    user.password = await user.generatePasswordHash();
});

User.prototype.generatePasswordHash = function () {
    if (this.password) {
        return bcrypt.hash(this.password, 10);
    }
};

User.hasMany(Server, {
    foreignkey: "ownerId",
    sourceKey: "id",
});
Server.belongsTo(User, { foreignkey: "ownerId", targetId: "id" });