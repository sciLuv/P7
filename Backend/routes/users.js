//express method ROUTER
import { Router } from 'express'; 
const router = Router();

//middleware to verify if user have the right to change the profil image  
import auth from '../middleware/auth.js'; 
//same
import { haveRightContent, haveRightUser} from '../middleware/right.js'; 
//middleware to manage image in the backend
import uploadImg from '../middleware/multer-config.js'; 
//controllers for users
import { signup, login, userInfoAfterRefresh, profilContent, getOneUser, profilChangeImg} from '../controllers/user.js'; 

//POST to create a new user profil
router.post('/signup', signup);
//POST to connect user to the website (with adding session token)
router.post('/login', login);
//Get actual infor of the user when navigator refeshing page 
router.get('/user/me', auth, userInfoAfterRefresh);
//Get to have information relative to an user
router.get('/user/:id', auth, getOneUser);
//GET to have all content from an user
router.get('/user/:id/content', auth, profilContent);
//PUT to change user profil image
router.put('/user/:id', auth, haveRightUser, uploadImg, profilChangeImg);

//exportation of the routes of users action to the app.js file
export default router;
