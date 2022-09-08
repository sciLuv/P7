import Content from "../models/content.js"; //model of content
import fs from 'fs'; // for delete image

//get infos of all the contents 
const getAll = (req, res) => {
    Content.findAll()
    .then(contents => res.status(200).json(contents))
    .catch(error => res.status(400).json({ error } + "Une erreur de transmission est survenue."));
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
    .then(() => { res.status(201).json({message: 'le contenue est en ligne.'})})
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
        Content.imgUrl = req.body.content && req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null;
        Content.save()
        .then(() => res.status(200).json({message : 'contenu modifié.'}))
        .catch(error => res.status(401).json( error  + "Il manque une information dans les champs qui représente votre contenu."));
    })
    .catch(error => res.status(401).json( error  + "Une erreur de transmission de donnée est survenue."));
};

//to delete one content
//if the content have a stored image in backend, delete it with fs.unlink and template litteral
//finally we delete the Content from the db with destroy method of sequelize
const deleteOne = (req, res) => {
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

//to manage like number of content and the array
//after finding the content in db in function if user Id is...
//...in array content them if user have alredy liked the content.
//if user doesn't have like we push his id to the array and add one like
//in the other case, we do the opposite
const like = (req, res) => {
    Content.findOne({where : {id :req.params.id}})
    .then( Content => {
            let usersLikeArray = Content.usersLike.users;
            let isLiked = usersLikeArray.findIndex((element) => element == req.auth.userId);
            if(isLiked == -1){
                usersLikeArray.push(req.auth.userId);
                Content.like += 1
            } else {
                usersLikeArray.splice((isLiked), 1);
                Content.like -= 1
            }
            let final = { users : usersLikeArray }
            Content.usersLike = final;
            Content.changed("usersLike", true)
            Content.save()
            .then(() => res.status(200).json({Content}))
            .catch(error => res.status(401).json( error  + "Une erreur de transmission de donnée est survenue."));

        }
    )
    .catch()
};

//exportation of the before declared functions for add them in the router
export { getAll, createOne, updateOne, deleteOne, like };
