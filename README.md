# Groupomania

**Private social media for members of the fictional groupomania compagnie.**
**Its the 7th, and the last, project of the OpenClassrooms dev web course.**

## Frontend
 (in work)
 
## Backend

A REST API with CRUD operations, and a MySQL database who manage 3 tables.  

### List of node not native backend package : 

**Express** : to create quickly backend server and it API <br><br>
**Sequelize** : to create models of element of database (users, contents, comments) and make link with.<br><br>
**Mysql2** : work with sequelize to push data to the database



**Dotenv** : *to remove environnement variable* from code to a specific file for security.<br><br>
**Password-validator** : configure password model to force user to do strong password.<br>
**Validator** : package for verify data send by users. *Use for validate email format with a blacklist chard*.<br><br>
**Crypto-js** : package of cryptage. *use to crypt the email to avoid data leakage.*<br><br>
**Bcript** : *to encrypt the password and compare encryption* with true password in the login.<br><br>
**Jsonwebtoken** : *create token session* to verify if user have authorization to do all actions in the app, except creation of account and login.<br><br>



**Multer** : to manage image in backend (get him name, and place).

### to install and use back-end : 

install nodeJS and its dependencies : ```npm install```<br>
create a .env file and asign a value to environnement variables<br>
run the server of the backend : ```nodemon app.js``` 
