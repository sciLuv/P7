import '../style/style.css';
import { useState, useContext } from 'react';
import { UserAuth } from '../utilis/contextValue.jsx';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisibility, setPasswordVisibility] = useState(false);

    let passwordContent = document.getElementById('password');

    function showPassword() {
        if (passwordVisibility === false) {
            setPasswordVisibility(true);
            passwordContent.type = 'text';
        } else {
            setPasswordVisibility(false);
            passwordContent.type = 'password';
        }
    }

    const authCtx = useContext(UserAuth);
    console.log(authCtx);

    const navigate = useNavigate();

    let handleSubmit = async (e) => {
        e.preventDefault();
        const reqOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mail: mail,
                password: password,
            }),
        };
        fetch('http://localhost:' + process.env.REACT_APP_BACKEND_PORT + '/login', reqOptions)
            .then((res) => res.json())
            .then((data) => {
                /*                 sessionStorage.setItem('auth', data.token);
                sessionStorage.setItem('userId', data.userId); */
                authCtx.login(data.token);
                authCtx.saveId(data.userId);
                authCtx.savePermission(data.userPermission);
                authCtx.saveImg(data.imgUrl);
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('id', data.userId);
                navigate('/');
                /* window.location.replace('http://localhost:' + process.env.REACT_APP_FRONTEND_PORT + '/'); */
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <form onSubmit={handleSubmit} className='container col-lg-12'>
            <h1 className='container col-xl-10 col-12 mt-3'>Se connecter</h1>
            <div className='container col-xl-8 col-12 mt-4'>
                <label htmlFor='email' className='form-label mt-3'>
                    Adresse mail
                </label>
                <input
                    type='email'
                    id='email'
                    name='user[mail]'
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
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
                            (passwordVisibility == false ? 'fa-eye-slash ' : 'fa-eye ') +
                            'align-self-end me-3'
                        }
                        id='togglePassword'
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
    );
}

export default Login;
