import { DataTypes } from 'sequelize';
import db from '../db/db.js';

const User = db.define('user', {
    firstname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imgUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    mail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    permission: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
});

export default User;
