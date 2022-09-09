import User from '../models/user.js'; // model of user

function rightFunction(User, contentOrComment, req, res, next){
    User.findOne({ where : { id : req.auth.userId}})
    .then( user =>{
        if(user.permission != true){
            contentOrComment.findOne({where: { id : req.params.id},})
            .then(contentOrComment => {
                if(contentOrComment.userId != req.auth.userId){
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

export default rightFunction