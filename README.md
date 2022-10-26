# Groupomania

**Private social media for members of the fictional groupomania compagnie.**
**Its the 7th, and the last, project of the OpenClassrooms dev web course.**

## Frontend
 A REACT APP Build with CREATE REACT APP

### List of node not native backend package : 

**Dotenv** : *to remove environnement variable* from code to a specific file for security.<br><br>
**styledComponent** : to write CSS directly in JSX files.

### to install and use front-end : 

install nodeJS and its dependencies, in front-end folder : ```npm install```<br>
create a .env file and asign a value to environnement variables<br>

after all that, in front-end folder : ```yarn start```, and its open the app.
 
## Backend

A REST API with CRUD operations, and a MySQL database who manage 3 tables.  

### List of node not native backend package : 

**Express** : to create quickly backend server and it API <br><br>
**Sequelize** : to create models of element of database (users, contents, comments) and make link with.<br><br>
**Mysql2** : work with sequelize to push data to the database.<br><br>
**Dotenv** : *to remove environnement variable* from code to a specific file for security.<br><br>
**Password-validator** : configure password model to force user to do strong password.<br><br>
**Validator** : package for verify data send by users. *Use for validate email format with a blacklist chard*.<br><br>
**Crypto-js** : package of cryptage. *use to crypt the email to avoid data leakage.*<br><br>
**Bcript** : *to encrypt the password and compare encryption* with true password in the login.<br><br>
**Jsonwebtoken** : *create token session* to verify if user have authorization to do all actions in the app, except creation of account and login.<br><br>
**Multer** : to manage image in backend (get him name, and place).<br><br>
**cors** : allows to avoid various errors related to the HTTP CORS security.<br><br>
**helmet** : increases the security of our http header returned not express.<br><br>
**express-rate-limit** : allows to limit the requests to one api to avoid server overload.
**he** : add the capacity to change caracter to html entites

### to install and use back-end : 

install nodeJS and its dependencies : ```npm install```<br>
create a .env file and asign a value to environnement variables<br>
run the server of the backend : ```nodemon app.js``` 
