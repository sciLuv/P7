import sequelize from 'sequelize'; //to create model, with define method
import { DataTypes } from 'sequelize'; //to define sql datatype 
import db from '../db/db.js'; //to add the model to the db

//the model of the comment composed with : 
//contentId : number, not null  
//userId : number, not null
//comment : string, not null
const Comment = db.define('comment', {
    contentId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

//exportation of the model to the controllers file
export default Comment;