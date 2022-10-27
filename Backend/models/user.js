import { DataTypes } from 'sequelize';
import db from '../db/db.js';
import Comment from './comment.js';
import Content from './content.js';
import cryptoJS from 'crypto-js'; //to crypt the admin email
import bcrypt from 'bcrypt'; //to hash the admin password

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

//intrication of comment in Content, by his contentId value
Content.hasMany(Comment, {
    foreignKey: 'contentId'
})
Comment.belongsTo(Content);


//creation of admin user in the beginning of the User Table in the creation of it
User.sync();
//encryption of mail and password of the admin to the database
const encryptedAdminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, Number(process.env.BCRYPT_SALT))
const cryptedAdminMail = cryptoJS.HmacSHA256(process.env.ADMIN_MAIL, process.env.CRYPTO_JS_SENTENCE).toString()
//creation itself
await User.findOrCreate({
    where : { id : 1},
    defaults : {
        firstname : process.env.ADMIN_FIRSTNAME,
        lastname : process.env.ADMIN_LASTNAME,
        imgUrl : 'http://localhost:' + process.env.PORT + '/images/defaultAvatar.png',
        mail : cryptedAdminMail, 
        password  : encryptedAdminPassword,
        permission : true
    } 
})


//export User model 
export default User;
