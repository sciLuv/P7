//style relative Import
import colors from '../utilis/colors';
import '../style/style.css';
import styled from 'styled-components';
//React and ReactRouter elements's import
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserAuth } from '../utilis/contextValue';
//function and React component import
import Content from '../components/Content.jsx';
import userConnect from '../utilis/reconnection';
import Header from '../components/Header.jsx';
import userInfoSuppr from '../utilis/userInfoSuppr.jsx';
import options from '../utilis/requestOptions.jsx';

const UserInfoContainer = styled.div`
    background-color: ${colors.tertiary};
    background-image: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0) 60%,
        rgba(0, 0, 0, 0.1516981792717087) 90%
    );
`;
const AvatarImgContainer = styled.div`
    height: 168px;
    width: 168px;
`;
const Avatar = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;
const CamContainer = styled.div`
    position: absolute;
    left: 148px;
    top: 200px;
    user-select: none;
`;

const Cam = styled.div`
    width: 30px;
    height: 30px;
    &::before {
        position: absolute;
        width: 30px;
        height: 30px;
        content: '';
        border-radius: 40px;
        opacity: 1;
        background: linear-gradient(158deg, #ffffff43 32%, #000000bd 100%);
        transition: 0.2s;
    }
    &::after {
        position: absolute;
        width: 30px;
        height: 30px;
        content: '';
        border-radius: 40px;
        opacity: 0;
        background: linear-gradient(140deg, #ffffff43 32%, #000000bd 100%);
        transition: 0.2s;
    }
    &:hover {
        cursor: pointer;
        font-size: 17px;
        transition: 0.1s;
        &::after {
            opacity: 1;
            transition: 0.2s;
        }
        &::before {
            opacity: 0;
            transition: 0.2s;
        }
    }
    background-color: ${(props) => (props.open ? '#131313' : '#fff')};
    color: ${(props) => (props.open ? '#fff' : '#262626')}; ;
`;

const FormAvatar = styled.form`
    position: absolute;
    top: -120px;
    @media (max-width: 576px) {
        width: 150px;
        & button,
        input {
            width: 100px;
            font-size: 12px;
        }
    }
`;

const UserNameContainer = styled.div`
    color: #e92700;
    @media (max-width: 576px) {
        font-size: 24px !important;
        margin-right: 30px !important;
        position: relative;
        top: ${(props) => (props.open ? '50px' : '0px')};
    }
`;

function Profil() {
    //actual users informations set in react memory, available everywhere in the app.
    const authCtx = useContext(UserAuth);

    //find value put in the link to the profil page, to select witch user's page to go, with his ID
    const location = useLocation();
    let idProfil = location.state;
    sessionStorage.setItem('lastProfilPageId', idProfil);
    if (idProfil == null) {
        idProfil = sessionStorage.getItem('lastProfilPageId');
    }

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
        //call to refesh content
        async function getProfilContent() {
            await fetch(ApiURL + '/user/' + idProfil + '/content', options(authCtx))
                .then((res) => {
                    if (!res.ok) {
                        userInfoSuppr();
                    } else {
                        return res.json();
                    }
                })
                .then((data) => {
                    //set the contents of the user
                    setUserContentList(data);
                    //call to refesh profil page
                    fetch(ApiURL + '/user/' + idProfil, options(authCtx))
                        .then((res) => {
                            return res.json();
                        })
                        .then((data) => {
                            setUserInfo(data);
                            if (idProfil === authCtx.id) {
                                authCtx.img = data.imgUrl;
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        async function main() {
            await userConnect(authCtx, navigate, ApiURL, setUserInfo);
            await getProfilContent();
        }

        main();
    }, [isPhotoUploadOpen, idProfil]);

    let SubmitNewAvatar = async (e) => {
        let formData = new FormData();
        formData.append('image', photoUpload);

        e.preventDefault();
        fetch(ApiURL + '/user/' + authCtx.id, options(authCtx, 'PUT', formData))
            .then((res) => res.json())
            .then((data) => {
                setIsPhotoUploadOpen(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <>
            <Header />
            <div className='profil-page-container'>
                <UserInfoContainer className=' d-flex align-items-center justify-content-between'>
                    <div>
                        <AvatarImgContainer className='m-3'>
                            <Avatar src={userInfo.imgUrl} className='img-fluid rounded-circle' alt='' />
                        </AvatarImgContainer>
                        <CamContainer>
                            {authCtx.id === idProfil ? (
                                <Cam
                                    className='d-flex justify-content-center align-items-center rounded-circle'
                                    open={isPhotoUploadOpen}
                                    onClick={() => {
                                        isPhotoUploadOpen
                                            ? setIsPhotoUploadOpen(false)
                                            : setIsPhotoUploadOpen(true);
                                    }}
                                >
                                    <i className='fa-solid fa-camera'></i>
                                </Cam>
                            ) : null}
                            {isPhotoUploadOpen ? (
                                <FormAvatar
                                    className='d-flex flex-column mt-2 ms-5'
                                    onSubmit={SubmitNewAvatar}
                                >
                                    <input
                                        type='file'
                                        onChange={(e) => setPhotoUpload(e.target.files[0])}
                                    ></input>
                                    <button type='submit' className='btn btn-danger align-self-start mt-3'>
                                        Changer de photo
                                    </button>
                                </FormAvatar>
                            ) : null}
                        </CamContainer>
                    </div>
                    <UserNameContainer className='mt-3 me-5 fs-1' open={isPhotoUploadOpen}>
                        <span>{userInfo.lastname} </span>
                        <span>{userInfo.firstname}</span>
                    </UserNameContainer>
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
        </>
    );
}

export default Profil;
