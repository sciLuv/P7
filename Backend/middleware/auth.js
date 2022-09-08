import jwt from "jsonwebtoken"; //to verify session verification token

//verify if the person in the app have the token session to do some action
const auth = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SENTENCE);
        const userId = decodedToken.userId; 
        req.auth = {
            userId : userId
        };
        next();
    } catch(error){
        res.status(401).json({ msg : "vous n'avez pas l'authorisation de faire cette requete" });
    }
}

export default auth;