import passwordValidator from 'password-validator'; //for password format validation
import validator from 'validator'; //for email format validation
import cryptoJS from 'crypto-js'; //to crypt the user's email
import bcrypt from 'bcrypt'; //to hash the password
import jwt from 'jsonwebtoken' //to give authorisation token 

import fs from 'fs'; //here, to delete img files from backEnd 

import User from '../models/user.js'; //model of user
import passwordSchema from '../models/password.js';//model of password 
import Content from '../models/content.js';//model of content
import Comment from "../models/comment.js"; //model of comment

//to add an user to database. 
//If email match with model waiting by validator.isEmail, it is crypted by cryptoJS
//if password match with model waiting by password-validator, it is encrypted by bcrypt
//once done, we create user with inital value of request body for fistname, lastname, imgUrl and permission
//for email and password, we pass the encryption version.
const signup = (req, res) => {
    const { body } = req;
    if (validator.isEmail(body.mail, { blacklisted_chars: process.env.MAIL_BLACKLIST_CHARS })) {
        const cryptedMail = cryptoJS.HmacSHA256(body.mail, process.env.CRYPTO_JS_SENTENCE).toString();
        if (passwordSchema.validate(body.password)) {
            bcrypt.hash(body.password, Number(process.env.BCRYPT_SALT))
                .then((hash) => {
                    delete body.mail, body.password;
                    User.create({
                        ...body,
                        mail: cryptedMail,
                        password: hash,
                        imgUrl: 'http://localhost:' + process.env.PORT + '/images/defaultAvatar.png',
                        permission: false,
                    })
                    .then(() => res.status(201).json({ message: 'Utilisateur crée.' }))
                    .catch((error) => res.status(400).json({ error } + 'Une erreur de transmission de donnée est survenue.'));
                })
                .catch((error) => res.status(500).json({ error } + 'Une erreur de serveur est survenue.'));
        } else {
            res.status(400).json({ message: 'Le mot de passe doit être composé de 8 caractères minimum avec une majuscule, un chiffre et un symbole au moins.'});
        }
    } else {
        res.status(401).json({ msg: "l'adresse mail n'est pas dans un format correct." });
    }
};

//to connect user to backend with a verification session token. 
//first, we crypt email to search user with this crypted email
//if we find user in db, we compare password with the crypted password in db with bcrypt.compare
//if compare method is valid we create a session validation token and pass it to the server response
const login = (req, res) => {
    const { body } = req;
    const cryptedMail = cryptoJS.HmacSHA256(body.mail, process.env.CRYPTO_JS_SENTENCE).toString();
    User.findOne({
        where: { mail : cryptedMail },
    })
    .then(user => {
        if(user === null){
            res.status(401).json({ message : 'Paire identifiant/mot de passe incorrecte.'});
        } else {
            bcrypt.compare(body.password, user.password)
            .then(valid => {
                if(!valid){
                    res.status(401).json({ message : 'Paire identifiant/mot de passe incorrecte.'});
                } else {
                    res.status(200).json({
                        userId : user.id,
                        token: jwt.sign(
                            { userId: user.id },
                            process.env.JWT_SENTENCE,
                            { expiresIn: '24h' }
                        )
                    })
                }
            })
            .catch( error => { res.status(500).json({error} + "une erreur de serveur est survenue.")})
        }
    })
    .catch(error =>{ res.status(500).json({ error } + "Une erreur de serveur est survenue." ) })
};

//to get all content from one user and his profil. 
const profilContent = (req, res) => {
    Content.findAll({
        where : { userId : req.params.id },
        include: {
            model: User,
            attributes: ['firstname', 'lastname', 'imgUrl']
        },
        include: {
            model: Comment,
            attributes: ['text', 'usersLike', 'like'],
            include: {
                model: User,
                attributes: ['firstname', 'lastname', 'imgUrl']
            }
        }
    })
    .then(contents => res.status(200).json(contents))
    .catch(error => res.status(400).json({ error } + "Une erreur de transmission est survenue."));
}

//to modify profil image
//we create the path of new image, delete the old image from the backend with fs.unlink
// and add the path of new image to user.imgURL 
const profilChangeImg = (req, res) => {
    const newImg = { imgUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` };
    User.findOne({where: {id: req.params.id}}) 
    .then(User => {
        const filename = User.imgUrl.split('/images/')[1];
        if(User.imgUrl != 'http://localhost:' + process.env.PORT + '/images/defaultAvatar.png'){
            const filename = User.imgUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`,(err) => {
                if (err) throw err;
                console.log('Fichier supprimée.');
             });
        }
        User.imgUrl = newImg.imgUrl;
        User.save()
        .then(() => res.status(200).json({message : 'photo de profil modifiée.'}))
        .catch(error => res.status(500).json( error  + "Une erreur de transmission est survenue."));
    })
    .catch(error =>{ res.status(500).json({ error } + "Une erreur de serveur est survenue." ) })
}

//exportation of the before declared functions for add them in the router
export { signup, login, profilContent, profilChangeImg };
