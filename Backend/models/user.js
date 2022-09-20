import { DataTypes } from 'sequelize';
import db from '../db/db.js';
import Comment from './comment.js';
import Content from './content.js';

//model of Users composed with : 
//firstname : string, not null  
//lastname : string, not null
//imgUrl : string, not null
//mail : string, not null
//password : string, not null
//permission : boolean, not null
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


//intrication of content and comment in User, by their userId value
User.hasMany(Content, {
    foreignKey: 'userId'
});
User.hasMany(Comment, {
    foreignKey: 'userId'
});

Content.belongsTo(User);
Comment.belongsTo(User);

//intrication of comment in Content, by his userId value
Content.hasMany(Comment, {
    foreignKey: 'contentId'
})
Comment.belongsTo(Content);


//creation of admin user in the beginning of the User Table in the creation of it
User.sync();
await User.findOrCreate({
    where : { id : 1},
    defaults : {
        firstname : process.env.ADMIN_FIRSTNAME,
        lastname : process.env.ADMIN_LASTNAME,
        imgUrl : 'http://localhost:' + process.env.PORT + '/images/defaultAvatar.png',
        mail : process.env.ADMIN_MAIL,
        password  : process.env.ADMIN_PASSWORD,
        permission : true
    } 
})



//export User model 
export default User;
