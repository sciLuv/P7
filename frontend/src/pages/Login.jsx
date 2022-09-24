import { useState, useContext } from 'react';
import { UserAuth } from '../utilis/contextValue.jsx';

function Login() {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const authCtx = useContext(UserAuth);
    console.log(authCtx);

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
                sessionStorage.setItem('auth', data.token);
                sessionStorage.setItem('userId', data.userId);
                window.location.replace('http://localhost:' + process.env.REACT_APP_FRONTEND_PORT + '/');
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
                <button type='submit' className='btn btn-danger mt-3'>
                    Se connecter
                </button>
            </div>
        </form>
    );
}

export default Login;
