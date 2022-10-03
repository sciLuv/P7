import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../utilis/contextValue.jsx';

function Reconnection() {
    const navigate = useNavigate();
    const authCtx = useContext(UserAuth);
    if (authCtx.token == undefined || authCtx.token == null) {
        const reqOptions = {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            },
        };
        fetch(
            'http://localhost:' +
                process.env.REACT_APP_BACKEND_PORT +
                '/user/' +
                sessionStorage.getItem('id'),
            reqOptions
        )
            .then((res) => res.json())
            .then((data) => {
                console.log('data');
                console.log(data);
                authCtx.login(sessionStorage.getItem('token'));
                authCtx.saveId(sessionStorage.getItem('id'));
                authCtx.savePermission(data.permission);
                authCtx.saveImg(data.imgUrl);
            })
            .catch((err) => {
                console.log(err);
                navigate('/login');
            });
    }
}

export default Reconnection;
