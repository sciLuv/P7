//express method ROUTER
import { Router } from 'express';
const router = Router();

//import all function to do all action in link with content 
import { getAll, createOne, updateOne, deleteOne, like } from '../controllers/content.js';
import auth from '../middleware/auth.js';//middleware to verify if the user is connected
import right from '../middleware/right.js';//middleware to verify if the user have the right to update or delete
import uploadImg from '../middleware/multer-config.js';//middleware to manage image in the backend

//GET to get all contents create
router.get('/', auth, getAll);
//POST to create a new content
router.post('/', auth, uploadImg, createOne);
//PUT to upload image or the text of the content, for the creator user and admin
router.put('/:id', auth, right, uploadImg, updateOne);
//DELETE the content, for the creator user and admin
router.delete('/:id', auth, right, deleteOne);
//POST to add or remove like to a comment
router.post('/:id/like', auth, like);


//exportation of the routes of contents action to the app.js file
export default router;

