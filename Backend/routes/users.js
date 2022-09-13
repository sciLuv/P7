//express method ROUTER
import { Router } from 'express'; 
const router = Router();

import auth from '../middleware/auth.js'; //middleware to verify if user have the right to change the profil image  
import { haveRightContent } from '../middleware/right.js'; //same
import uploadImg from '../middleware/multer-config.js'; //middleware to manage image in the backend
import { signup, login, profilContent, profilChangeImg } from '../controllers/user.js'; //controllers for users
//POST to create a new user profil
router.post('/signup', signup);
//POST to connect user to the website (with adding session token)
router.post('/login', login);
//GET to have all content from an user
router.get('/profil/:id', auth, haveRightContent, profilContent)
//PUT to change user profil image
router.put('/profil/:id', auth, haveRightContent, uploadImg, profilChangeImg);

//exportation of the routes of users action to the app.js file
export default router;
