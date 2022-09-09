//express method ROUTER
import { Router } from 'express';
const router = Router();

//import all function to do all action in link with comment 
import { getContentComment, createOneComment, updateOneComment, deleteOneComment} from '../controllers/comment.js';
//middleware to verify if the user is connected
import auth from '../middleware/auth.js'; 
//middleware to verify if the user have the right to update or delete
import {haveRightComment} from '../middleware/right.js';

//permet de chercher les commentaire d'un  contenues
router.get('/:id/comment', auth, getContentComment);
//crée un commentaire en lien avec un contenue
router.post('/:id/comment', auth, createOneComment);
//modifie un commentaire précédement crée
router.put('/comment/:id', auth, haveRightComment, updateOneComment);
//supprime un commentaire précédemment crée
router.delete('/comment/:id', auth, haveRightComment, deleteOneComment);

export default router;