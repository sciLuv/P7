import Comment from '../models/comment.js'; //model of comment
import User from '../models/user.js'; //model of user

//middleware of verification of right to upload or delete comment
//two possibilities for that : (1) have admin permission or (2) be log with the account who have create the comment
//(1)find the user in db and verify if his permission value is "permission = true"
//(2)verify if the userId decrypted from the session token is the same id of the comment
const haveRightComment = (req, res, next) => {
    User.findOne({ where : { id : req.auth.userId}})
    .then( User =>{
        if(User.permission != true){
                Comment.findOne({where: { id : req.params.comId},})
            .then(Comment => {
                if(Comment.userId != req.auth.userId){
                    res.status(401).json({message: 'Vous n\'avez pas l\'authorisation de mettre à jour ce commentaire.'});
                } else {
                    next();
                }
            })
            .catch( error => {
                res.status(500).json({ error } + "Une erreur de serveur est survenue.");
            });
        } else {
            next();
        }
    })
    .catch( error => {
        res.status(500).json({ error } + "Une erreur de serveur est survenue");
    });
}

export default haveRightComment