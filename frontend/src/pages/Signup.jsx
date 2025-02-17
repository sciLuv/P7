//React and ReactRouter elements's import
import { useState } from 'react'; //react method to use data in state and context
import { useNavigate } from 'react-router-dom'; //react-dom method to go to another page
//React component
import Header from '../components/Header'; //header component

//function in link with all thing happen in the home page
function Signup(props) {
    //all constants using react state to save info in link with user inscription
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');

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

    //allow possibilities to go to another page of the application with link, with no page refreshing
    const navigate = useNavigate();

    //to send request to the server to create account
    let handleSubmit = async (e) => {
        e.preventDefault();
        const reqOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstname: firstname,
                lastname: lastname,
                mail: mail,
                password: password,
            }),
        };
        fetch('http://localhost:' + process.env.REACT_APP_BACKEND_PORT + '/signup', reqOptions)
            .then((res) => res.json())
            .then((data) => {
                navigate('/login');
                console.log(data);
            })
            .catch((err) => console.log(err));
    };

    //here, use the bootstrap class to adding style to the component.
    return (
        <>
            <Header />
            <form onSubmit={handleSubmit} className='container col-lg-12'>
                <h1 className='container col-xl-10 col-12 mt-3'>S'inscrire</h1>
                <div className='container col-xl-8 col-12 mt-4'>
                    <label htmlFor='firstname' className='form-label'>
                        Prénom
                    </label>
                    <input
                        type='text'
                        id='firstname'
                        name='user[firstname]'
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        className='form-control'
                        placeholder='Xavier, Véronique, ect...'
                        aria-label='Prénom'
                        aria-describedby='basic-addon1'
                    />
                    <label htmlFor='lastname' className='form-label mt-3'>
                        Nom
                    </label>
                    <input
                        type='text'
                        id='lastname'
                        name='user[lastname]'
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        className='form-control'
                        placeholder='Dupont, Chevalier, ect...'
                        aria-label='Nom'
                        aria-describedby='basic-addon1'
                    />
                    <label htmlFor='email' className='form-label mt-3'>
                        Adresse Mail
                    </label>
                    <input
                        type='email'
                        id='email'
                        name='user[mail]'
                        value={mail}
                        onChange={(e) => setMail(e.target.value)}
                        className='form-control'
                        placeholder='XavierChevalier@gmail.com, ect...'
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='form-control'
                            placeholder=''
                            aria-label='Mot de passe'
                            aria-describedby='passwordHelpBlock'
                        />
                        <i
                            className={
                                'far ' +
                                (passwordVisibility === false ? 'fa-eye-slash ' : 'fa-eye ') +
                                'align-self-end me-3'
                            }
                            id='togglePassword'
                            onClick={() => {
                                showPassword();
                            }}
                        ></i>
                    </div>
                    <div id='passwordHelpBlock' className='form-text'>
                        Votre mot de passe doit faire 8 caractères, être composé de minuscule, de majuscule,
                        de chiffre et de symbole.
                    </div>
                    <button type='submit' className='btn btn-danger mt-3'>
                        s'incrire
                    </button>
                </div>
            </form>
        </>
    );
}

export default Signup;
