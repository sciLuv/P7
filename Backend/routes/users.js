//express method ROUTER
import { Router } from 'express'; 
const router = Router();

import auth from '../middleware/auth.js'; //middleware to verify if user have the right to change the profil image  
import right from '../middleware/right.js'; //same
import uploadImg from '../middleware/multer-config.js'; //middleware to manage image in the backend

import { signup, login, profil } from '../controllers/user.js';
//POST to create a new user profil
router.post('/signup', signup);
//POST to connect user to the website (with adding session token)
router.post('/login', login);
//PUT to change user profil image
router.put('/profil/:id', auth, right, uploadImg, profil);

//exportation of the routes of users action to the app.js file
export default router;
