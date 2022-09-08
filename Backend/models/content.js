import sequelize from 'sequelize'; //to create model, with define method
import { DataTypes } from 'sequelize'; //to define sql datatype 
import db from '../db/db.js'; //to add the model to the db

//the model of the content composed with : 
// userId : number not null, text : string  not null, 
//imgUrl : string (path of the image) can be null
// like : number, usersLike : JSON object with default
const Content = db.define('content', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imgUrl: {
        type: DataTypes.STRING
    },
    like: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue : 0 
    },
    usersLike: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue : {users : []}
    }
});

//exportation of the model to the controllers file
export default Content;
