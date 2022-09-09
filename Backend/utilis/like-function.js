//to manage like number of content/comment and the array
//after finding the content in db in function if user Id is...
//...in array content them if user have alredy liked the content.
//if user doesn't have like we push his id to the array and add one like
//in the other case, we do the opposite
function likeFunction(contentOrComment, req, res){ 
    contentOrComment.findOne({where : {id :req.params.id}})
    .then( ContentOrComment => {
            let usersLikeArray = ContentOrComment.usersLike.users;
            let isLiked = usersLikeArray.findIndex((element) => element == req.auth.userId);
            if(isLiked == -1){
                usersLikeArray.push(req.auth.userId);
                ContentOrComment.like += 1
            } else {
                usersLikeArray.splice((isLiked), 1);
                ContentOrComment.like -= 1
            }
            let final = { users : usersLikeArray }
            ContentOrComment.usersLike = final;
            ContentOrComment.changed("usersLike", true)
            ContentOrComment.save()
            .then(() => res.status(200).json({ContentOrComment}))
            .catch(error => res.status(401).json( error  + "Une erreur de transmission de donnée est survenue."));

        }
    )
    .catch(error => res.status(500).json( error  + "Une erreur de serveur est survenue."));
}

export default likeFunction