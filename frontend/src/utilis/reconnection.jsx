import userInfoSuppr from './userInfoSuppr.jsx'; //delete data in session storage

//function to refind user information when user reload the app with navigator button
async function userConnect(authCtx, navigate, ApiURL, setUserInfo) {
    //part of the function to verify if there are token save in session storage
    //if its dont save, redirection to the login page, else send request to API
    let storageOrStateToken;
    if (!sessionStorage.getItem('token')) {
        userInfoSuppr();
    } else {
        storageOrStateToken = sessionStorage.getItem('token');

        const reqOptions = {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + storageOrStateToken,
            },
        };
        //the request to the API to get user information
        await fetch(ApiURL + '/user/me', reqOptions)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setUserInfo(data);
                if (authCtx.token == null) {
                    //put informations of the api response to the react context
                    authCtx.token = sessionStorage.getItem('token');
                    authCtx.id = data.id;
                    authCtx.permission = data.permission;
                    authCtx.img = data.imgUrl;
                }
            })
            .catch((err) => {
                console.log(err);
                navigate('/login');
            });
    }
}

export default userConnect;
