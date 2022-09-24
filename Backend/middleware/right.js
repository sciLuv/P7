import Content from '../models/content.js'; //model of content
import Comment from '../models/comment.js'; //model of comment
import User from '../models/user.js'; // model of user
import rightFunction from '../utilis/right-function.js';

/* import rightFunction from '../utilis/right-function.js'; */

//middleware of verification of right to upload or delete content, comment
//two possibilities for that : (1) have admin permission or (2) be log with the account who have create the content
//(1)find the user in db and verify if his permission value is "permission = true"
//(2)verify if the userId decrypted from the session token is the same id of the content
const haveRightContent = (req, res, next) => { rightFunction(User, Content, req, res, next); };
const haveRightComment = (req, res, next) => { rightFunction(User, Comment, req, res, next); };

//middleware for verification to modify img of avator of users
const haveRightUser = (req, res, next) => {
    User.findOne({ where : { id : req.auth.userId}})
    .then( user => {
        if(user.permission == false){
                if(req.params.id != req.auth.userId){
                    res.status(401).json({message: 'Vous n\'avez pas l\'authorisation de mettre à jour cette publication.'});
                } else {
                    next();
                }
        } else {
            next();
        }
    })
    .catch( error => {
        res.status(500).json({ error } + "Une erreur de serveur est survenue.");
    });
}

//export the two right middleware
export { haveRightComment, haveRightContent, haveRightUser};