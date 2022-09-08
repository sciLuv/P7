//nodeJS module to create a schema to force user to do strong password
import passwordValidator from 'password-validator';  

//password of min 8 signs min & 30 max
//with lowercase, uppercase, symbol and digit
//spaces are forbidden 
const passwordSchema = new passwordValidator();
passwordSchema
    .is().min(8)
    .is().max(30)
    .has().uppercase()
    .has().lowercase()
    .has().symbols()
    .has().digits()
    .has().not().spaces()

//export the password model to user controllers
export default passwordSchema;
