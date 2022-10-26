import Content from "../models/content.js"; //model of content
import User from '../models/user.js'; //model of user
import Comment from "../models/comment.js"; //model of comment
import fs from 'fs'; // for delete image
import likeFunction from "../utilis/like-function.js"; //function to add like
import decodeHTMLentities from "../utilis/decode-function.js";
import he from "he";


//get infos of all the contents  
const getAll = (req, res) => {
    const pageAsNumber = Number(req.query.page);
    if(isNaN(pageAsNumber)){
        res.status(400).json("Une erreur de transmission est survenueeee.");
    }

    Content.findAndCountAll({
        limit: 10,
        offset : pageAsNumber * 10,
        distinct: true,
        order: [['createdAt', 'DESC'], [{model : Comment}, 'createdAt', 'ASC']],
        include: [
            {
                model: User,
                attributes: ['firstname', 'lastname', 'imgUrl']
            },
            {
                model: Comment,
                attributes: ['id'],
            }
        ],
    })
    .then(contents => {
        decodeHTMLentities(contents.rows); 
        res.status(200).json(contents);
    })
    .catch(error => {res.status(400).json({ error } + "Une erreur de transmission est survenue.");});
};

//create a new content
//with required text, image path or not (with ternary operator and template litteral) 
//and the id from the user who create the content
const createOne = (req, res) => {
    Content.create({
        text : JSON.parse(req.body.content).text,
        userId : req.auth.userId,
        imgUrl: req.body.content && req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null
    })
    .then(() => { 
        Content.findAndCountAll({
            limit: 10,
            order: [['createdAt', 'DESC'], [{model : Comment}, 'createdAt', 'ASC']],
            include: [
                {
                    model: User,
                    attributes: ['firstname', 'lastname', 'imgUrl']
                },
                {
                    model: Comment,
                    attributes: ['id'],
                }
            ]
        })
        .then(contents => {
            decodeHTMLentities(contents.rows); 
            res.status(200).json(contents);
        })
        .catch(error => {res.status(400).json({ error } + "Une erreur de transmission est survenue.");});
    })
    .catch(error => {res.status(400).json({error} + "Une erreur de transmission est survenue.")})
};

//to change something in one content
//finding the content in db, 
//if user add new image, and if there are already an image, delete it, with fs.unlink method
//after that upload new text, image path or not (with ternary operator and template litteral) 
const updateOne = (req, res) => {
    Content.findOne({where : {id :req.params.id}})
    .then( Content => {
        if(req.file){
            if(Content.imgUrl != null){
                const filename = Content.imgUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`,(err) => {
                    if (err) throw err;
                    console.log('Fichier supprimé !');
                 });
            }
        }
        Content.text = JSON.parse(req.body.content).text;
        Content.imgUrl = req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : Content.imgUrl;
        Content.save()
        .then(Content => {
            Content.text = he.decode(Content.text);
            res.status(200).json(Content);
        })
        .catch(error => res.status(401).json( error  + "Il manque une information dans les champs qui représente votre contenu."));
    })
    .catch(error => res.status(401).json( error  + "Une erreur de transmission de donnée est survenue."));
};

//to delete one content
//if the content have a stored image in backend, delete it with fs.unlink and template litteral
//finally we delete the Content from the db with destroy method of sequelize
const deleteOne = (req, res) => {
    console.log(Content);
    Content.findOne({where : {id :req.params.id}})
    .then(Content => {
        if(Content.imgUrl != null){
            const filename = Content.imgUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`,(err) => {
                if (err) throw err;
                console.log('Fichier supprimé !');
            })
        }
        Content.destroy({where: {id : req.params.id}})
        .then(() => res.status(200).json({message : 'contenu supprimé.'}))
        .catch(error => res.status(401).json( error  + "Une erreur de transmission de donnée est survenue."));
    })
    .catch(error => res.status(401).json( error  + "Une erreur de transmission de donnée est survenue."));
};

//to add or remove like to a content
const like = (req, res) => { likeFunction(Content, req, res); };

//exportation of the before declared functions for add them in the router
export { getAll, createOne, updateOne, deleteOne, like };
