import colors from '../utilis/colors';
import '../style/style.css';
import styled from 'styled-components';
import { useState, useEffect, useContext } from 'react';
import { UserAuth } from '../utilis/contextValue';
import { Link, useNavigate } from 'react-router-dom';
import Content from '../components/Content.jsx';
import { useLocation } from 'react-router-dom';

const UserInfoContainer = styled.div`
    background-color: ${colors.tertiary};
`;

function Profil() {
    //actual users informations set in react memory, available everywhere in the app.
    const authCtx = useContext(UserAuth);

    //find value put in the link to the profil page, to select witch user's page to go, with his ID
    const location = useLocation();
    const idProfil = location.state;

    /* if (idProfil == null) {
        idProfil = authCtx.id;
    } */

    //allow possibilities to go to another page of the application with link, with no page refreshing
    const navigate = useNavigate();

    //Base of URL to get path to the API
    const ApiURL = 'http://localhost:' + process.env.REACT_APP_BACKEND_PORT;

    //multiple States
    const [userContentList, setUserContentList] = useState([]); //array of the user's created content
    const [userInfo, setUserInfo] = useState([]); //array of the information of the user
    const [isPhotoUploadOpen, setIsPhotoUploadOpen] = useState(false); // boolean to know if image upload is open
    const [photoUpload, setPhotoUpload] = useState(null); //to put in the new avator img to upload

    //call to the API to get all users content in the DB, and associate Comments
    useEffect(() => {
        const reqOptions = {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + authCtx.token,
            },
        };
        //call to refesh content
        fetch(ApiURL + '/user/' + idProfil + '/content', reqOptions)
            .then((res) => {
                if (!res.ok) {
                    navigate('/login');
                } else {
                    return res.json();
                }
            })
            .then((data) => {
                //set the contents of the user
                setUserContentList(data);
                console.log(data);
                //call to refesh profil page
                fetch(ApiURL + '/user/' + idProfil, reqOptions)
                    .then((res) => {
                        return res.json();
                    })
                    .then((data) => {
                        setUserInfo(data);
                        if (idProfil === authCtx.id) {
                            authCtx.saveImg(data.imgUrl);
                            console.log('testProfil');
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    }, [isPhotoUploadOpen, idProfil]);

    let SubmitNewAvatar = async (e) => {
        let formData = new FormData();
        formData.append('image', photoUpload);

        e.preventDefault();
        const reqOptions = {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + authCtx.token,
            },
            body: formData,
        };
        fetch(ApiURL + '/user/' + authCtx.id, reqOptions)
            .then((res) => res.json())
            .then((data) => {
                setIsPhotoUploadOpen(false);
                console.log('testAvatar');
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <div className='profil-page-container'>
            <UserInfoContainer className=' d-flex align-items-center justify-content-between'>
                <div>
                    <div className='p-4'>
                        <img
                            src={userInfo.imgUrl}
                            className='img-fluid rounded-circle avatar-profil-page'
                            alt=''
                        />
                    </div>
                    <div className='camContainer d-flex'>
                        {authCtx.id === idProfil ? (
                            <div
                                className='cam border border-danger border-2 d-flex justify-content-center align-items-center rounded-circle bg-light'
                                onClick={() => {
                                    isPhotoUploadOpen
                                        ? setIsPhotoUploadOpen(false)
                                        : setIsPhotoUploadOpen(true);
                                }}
                            >
                                <i className='fa-solid fa-camera'></i>
                            </div>
                        ) : null}
                        {isPhotoUploadOpen ? (
                            <form
                                className='d-flex justify-content-between mt-2 ms-5'
                                onSubmit={SubmitNewAvatar}
                            >
                                <input
                                    type='file'
                                    onChange={(e) => setPhotoUpload(e.target.files[0])}
                                ></input>
                                <button type='submit' className='btn btn-primary'>
                                    Changer de photo de profil
                                </button>
                            </form>
                        ) : null}
                    </div>
                </div>
                <div className='mt-3 me-5 text-danger fs-3'>
                    <span>{userInfo.lastname} </span>
                    <span>{userInfo.firstname}</span>
                </div>
            </UserInfoContainer>
            <div className='container'>
                {userContentList.map((content) => (
                    <Content
                        key={content.id}
                        contentId={content.id}
                        firstname={content.user.firstname}
                        lastname={content.user.lastname}
                        avatar={content.user.imgUrl}
                        text={content.text}
                        img={content.imgUrl}
                        comments={content.comments}
                        like={content.like}
                        usersLike={content.usersLike}
                        date={content.createdAt}
                        userId={content.userId}
                        contentList={userContentList}
                        setContentList={setUserContentList}
                    />
                ))}
            </div>
        </div>
    );
}

export default Profil;
