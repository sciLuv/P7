//React and ReactRouter elements's import
import { useState, useContext } from 'react'; //react method to use data in state and context
import { UserAuth } from '../utilis/contextValue.jsx'; //function to put user information to the context of the app
import { useNavigate } from 'react-router-dom'; //react-dom method to go to another page
//React component
import Header from '../components/Header.jsx'; //header component
//function
import options from '../utilis/requestOptions.jsx'; //function to manage option of the call of the API

//function in link with all we can do in the login page
function Login() {
    //base URL of the API
    const apiURL = 'http://localhost:' + process.env.REACT_APP_BACKEND_PORT + '/login';

    //constants in link with the connection
    const [mail, setMail] = useState(''); //state for the mail, in link with the form of login
    const [password, setPassword] = useState(''); //same, but for the password

    //constant and variable in link with control of visibility of the password input
    let passwordContent = document.getElementById('password'); //JS representation of the password input
    const [passwordVisibility, setPasswordVisibility] = useState(false); //state to see or not the password

    //function to show or not the password text in the input
    //true = password is visible and the input is text, false = password invisible, input is password
    function showPassword() {
        if (passwordVisibility === false) {
            setPasswordVisibility(true);
            passwordContent.type = 'text';
        } else {
            setPasswordVisibility(false);
            passwordContent.type = 'password';
        }
    }

    //actual users informations set in react memory, available everywhere in the app.
    const authCtx = useContext(UserAuth);
    //allow possibilities to go to another page of the application with link, with no page refreshing
    const navigate = useNavigate();

    //to send request to the server for login
    let handleSubmit = async (e) => {
        e.preventDefault();
        //construction of the body send to the API
        let body = JSON.stringify({
            mail: mail,
            password: password,
        });
        fetch(apiURL, options(authCtx, 'POST', body, 'application/json'))
            .then((res) => res.json())
            .then((data) => {
                //here we put info send by the API about the user in react context and the token in the sessionStorage
                authCtx.login(data.token);
                authCtx.saveId(data.userId);
                authCtx.savePermission(data.userPermission);
                authCtx.saveImg(data.imgUrl);
                sessionStorage.setItem('token', data.token);
                navigate('/');
            })
            .catch((err) => {
                console.log(err);
            });
    };

    //here, use the bootstrap class to adding style to the component.
    return (
        <>
            <Header />
            <form onSubmit={handleSubmit} className='container col-lg-12'>
                <h1 className='container col-xl-10 col-12 mt-3'>Se connecter</h1>
                <div className='container col-xl-8 col-12 mt-4'>
                    <label htmlFor='email' className='form-label mt-3'>
                        Adresse mail
                    </label>
                    <input
                        //in link with the state of the mail
                        value={mail}
                        //event to adding the mail to the associate react state
                        onChange={(e) => setMail(e.target.value)}
                        type='email'
                        id='email'
                        name='user[mail]'
                        className='form-control'
                        placeholder=''
                        aria-label='Adresse mail'
                        aria-describedby='basic-addon1'
                    />
                    <label htmlFor='password' className='form-label mt-3'>
                        Mot de passe
                    </label>
                    <div className='d-flex flex-column'>
                        <input
                            type='password'
                            id='password'
                            name='user[password]'
                            //in link with the state of the password
                            value={password}
                            //event to adding the password to the associate react state
                            onChange={(e) => setPassword(e.target.value)}
                            className='form-control'
                            placeholder=''
                            aria-label='Mot de passe'
                            aria-describedby='passwordHelpBlock'
                        />
                        <i
                            id='togglePassword'
                            //change the class of the icon to represent the visibility of the password
                            className={
                                'far ' +
                                (passwordVisibility === false ? 'fa-eye-slash ' : 'fa-eye ') +
                                'align-self-end me-3'
                            }
                            //event to change type of the input in function of the visibility of the input
                            onClick={() => {
                                showPassword();
                            }}
                        ></i>
                    </div>
                    <button type='submit' className='btn btn-danger mt-3'>
                        Se connecter
                    </button>
                </div>
            </form>
        </>
    );
}

export default Login;
