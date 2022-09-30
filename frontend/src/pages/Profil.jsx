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
    const location = useLocation();
    const idProfil = location.state;

    const ApiURL = 'http://localhost:' + process.env.REACT_APP_BACKEND_PORT;
    const navigate = useNavigate();
    const authCtx = useContext(UserAuth);
    const [userContentList, setUserContentList] = useState([]);
    const [userInfo, setUserInfo] = useState([]);
    const [isPhotoUploadOpen, setIsPhotoUploadOpen] = useState(false);

    useEffect(() => {
        const reqOptions = {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + authCtx.token,
            },
        };
        fetch(ApiURL + '/user/' + idProfil + '/content', reqOptions)
            .then((res) => {
                if (!res.ok) {
                    navigate('/login');
                } else {
                    return res.json();
                }
            })
            .then((data) => {
                setUserContentList(data);
                fetch(ApiURL + '/user/' + idProfil, reqOptions)
                    .then((res) => {
                        return res.json();
                    })
                    .then((data) => {
                        setUserInfo(data);
                        console.log(data);
                        if (idProfil === authCtx.id) {
                            authCtx.saveImg(data.imgUrl);
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

    const [photoUpload, setPhotoUpload] = useState(null);

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
            .then((res) => {
                console.log(res);
                res.json();
            })
            .then((data) => {
                setIsPhotoUploadOpen(false);
                console.log(authCtx);
                console.log(userInfo.imgUrl);
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
