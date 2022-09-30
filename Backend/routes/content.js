//express method ROUTER
import { Router } from 'express';
const router = Router();

//import all function to do all action in link with content 
import { getAll, createOne, updateOne, deleteOne, like } from '../controllers/content.js';
//middleware to verify if the user is connected
import auth from '../middleware/auth.js';
//middleware to verify if the user have the right to update or delete
import { haveRightContent } from '../middleware/right.js';
//middleware to manage image in the backend
import uploadImg from '../middleware/multer-config.js';
//middleware to sanitize corpse of content of his dangerous parts
import sanitize from '../middleware/sanitize.js';


//GET to get all contents create
router.get('/content', auth, getAll);
//POST to create a new content
router.post('/content', auth,  uploadImg, sanitize, createOne);
//PUT to upload image or the text of the content, for the creator user and admin
router.put('/content/:id', auth, haveRightContent, uploadImg, sanitize, updateOne);
//DELETE the content, for the creator user and admin
router.delete('/content/:id', auth, haveRightContent, deleteOne);
//POST to add or remove like to a content
router.post('/content/:id/like', auth, like);


//exportation of the routes of contents action to the app.js file
export default router;

