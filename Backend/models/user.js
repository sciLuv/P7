import { DataTypes } from 'sequelize';
import db from '../db/db.js';
import Comment from './comment.js';
import Content from './content.js';

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

User.hasMany(Content, {
    foreignKey: 'userId'
});
User.hasMany(Comment, {
    foreignKey: 'userId'
});
Content.belongsTo(User);
Content.hasMany(Comment, {
    foreignKey: 'contentId'
})
Comment.belongsTo(User);
Comment.belongsTo(Content);

export default User;
