import Comment from "../models/comment.js"; //model of comment
import User from '../models/user.js'; //model of user
import likeFunction from "../utilis/like-function.js"; //function to add like
import decodeHTMLentities from "../utilis/decode-function.js";

//find all the comments in link with one content
const getContentComment = (req, res) => {
    Comment.findAll({
        order: [['createdAt', 'ASC']],
        where : { contentId : req.params.id },
        include: {
            model: User,
            attributes: ['firstname', 'lastname', 'imgUrl']
            }
        })
        .then(comments => { 
            decodeHTMLentities(comments);
            res.status(201).json(comments)
        })
        .catch(error => res.status(400).json({ error } + "Une erreur de transmission de donnée est survenue."));
}

//create a new comment in link with one content and one user (and their id)
const createOneComment = (req, res) => {
    Comment.create({
        text : req.body.text,
        userId : req.auth.userId,
        contentId : req.params.id
    })
    .then(() => { 
        Comment.findAll({
            order: [['createdAt', 'ASC']],
            where : { contentId : req.params.id },
            include: {
                model: User,
                attributes: ['firstname', 'lastname', 'imgUrl']
                }
            })
            .then(comments => { 
                decodeHTMLentities(comments);
                res.status(201).json({comments})
            })
            .catch(error => res.status(400).json({ error } + "Une erreur de transmission de donnée est survenue."));
    })
    .catch(error => res.status(400).json({ error } + "Une erreur de transmission de donnée est survenue."));
}

//update a comment with findOne and save methods from sequelize
const updateOneComment = (req, res) => {
    Comment.findOne({ where: { id : req.params.id}})
    .then( Comment => {
        Comment.text = req.body.text;
        Comment.save()
        .then(() => { res.status(201).json({message: 'le commentaire est modifié.'})})
        .catch(error => res.status(400).json({ error } + "Une erreur de transmission de donnée est survenue."));
    })
    .catch(error => res.status(400).json({ error } + "Une erreur de transmission de donnée est survenue."));
}

//delete a comment with destroy method from sequelize
const deleteOneComment = (req, res) => {
    Comment.destroy({where: {id : req.params.id}})
    .then(() => res.status(200).json({message : 'commentaire supprimé.'}))
    .catch(error => res.status(401).json( error  + "Une erreur de transmission de donnée est survenue."));
}

//to add or remove like to a content
const likeComment = (req, res) => { likeFunction(Comment, req, res)};

//exportation of the before declared functions for add them in the router
export { getContentComment, createOneComment, updateOneComment, deleteOneComment, likeComment };