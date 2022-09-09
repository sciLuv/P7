import Content from '../models/content.js'; //model of content
import Comment from '../models/comment.js'; //model of comment
import User from '../models/user.js'; // model of user
import rightFunction from '../utilis/right-function.js';

/* import rightFunction from '../utilis/right-function.js'; */

//middleware of verification of right to upload or delete content
//two possibilities for that : (1) have admin permission or (2) be log with the account who have create the content
//(1)find the user in db and verify if his permission value is "permission = true"
//(2)verify if the userId decrypted from the session token is the same id of the content
const haveRightContent = (req, res, next) => { rightFunction(User, Content, req, res, next); };
const haveRightComment = (req, res, next) => { rightFunction(User, Comment, req, res, next); };

//export the two right middleware
export { haveRightComment, haveRightContent};