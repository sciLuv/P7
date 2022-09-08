import Content from '../models/content.js'; //model of content
import User from '../models/user.js'; // model of user

//middleware of verification of right to upload or delete content
//two possibilities for that : (1) have admin permission or (2) be log with the account who have create the content
//(1)find the user in db and verify if his permission value is "permission = true"
//(2)verify if the userId decrypted from the session token is the same id of the content
const haveRight = (req, res, next) =>{
    User.findOne({ where : { id : req.auth.userId}})
    .then( User =>{
        if(User.permission != true){
                Content.findOne({where: { id : req.params.id},})
            .then(Content => {
                if(Content.userId != req.auth.userId){
                    res.status(401).json({message: 'Vous n\'avez pas l\'authorisation de mettre à jour cette publication.'});
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
        res.status(500).json({ error } + "Une erreur de serveur est survenue.");
    });
}

export default haveRight