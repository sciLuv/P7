//style relative Import
import styled from 'styled-components'; // to stylish component directly in the react file
import colors from '../utilis/colors'; //CSS colors value
//React and ReactRouter elements's import
import { useState, useEffect, useContext } from 'react'; //react method to use data in state and context
import { UserAuth } from '../utilis/contextValue'; //function to put user information to the context of the app
import { useNavigate, useLocation } from 'react-router-dom'; //react-dom method to go to another page
//React component
import Content from '../components/Content.jsx'; //content component
import Header from '../components/Header.jsx'; //header component
//function
import userConnect from '../utilis/reconnection'; //call to the API to find again user info with token in sessionStorage
import userInfoSuppr from '../utilis/userInfoSuppr.jsx'; //delete data in session storage
import options from '../utilis/requestOptions.jsx'; //function to manage option of the call of the API

//the css style of the home page
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

    //using props open to change the style of the button use to open the input to change image, for user feedBack
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
        //change position of the userName in little device to have better interface when user open input file
        top: ${(props) => (props.open ? '50px' : '0px')};
    }
`;

//function in link with all thing happen in the profil page
function Profil() {
    //find value put in the link to the profil page, to select witch user's page to go, with his ID...
    const location = useLocation();
    let idProfil = location.state;
    //...and put the ID in the sessionStorage
    sessionStorage.setItem('lastProfilPageId', idProfil);
    //if the idProfil is null we use the one already in sessionStorage
    if (idProfil == null) {
        idProfil = sessionStorage.getItem('lastProfilPageId');
    }

    //Base of URL to get path to the API
    const apiURL = 'http://localhost:' + process.env.REACT_APP_BACKEND_PORT;

    //constants in link with gereration of the profil page
    const [userContentList, setUserContentList] = useState([]); //array of the user's created content
    const [userInfo, setUserInfo] = useState([]); //array of the information of the user

    //constants in link with image uploading and his inteface
    const [isPhotoUploadOpen, setIsPhotoUploadOpen] = useState(false); // boolean to know if image upload is open
    const [photoUpload, setPhotoUpload] = useState(null); //to put in the new avator img to upload

    //actual users informations set in react memory, available everywhere in the app.
    const authCtx = useContext(UserAuth);
    //method of react-router allow possibilities to go to another page of the application with link, with no page refreshing
    const navigate = useNavigate();

    //call to the API to get all users content in the DB, and associate Comments
    useEffect(
        () => {
            //call to refesh content of the profil page
            async function getProfilContent() {
                //call to the API to get content only create by the user in link with the profil page
                await fetch(apiURL + '/user/' + idProfil + '/content', options(authCtx))
                    .then((res) => {
                        if (!res.ok) {
                            userInfoSuppr(); //to delete sessionStorage information if the request it's not ok
                        } else {
                            return res.json();
                        }
                    })
                    .then((data) => {
                        //set the contents of the user
                        setUserContentList(data);
                        //API call to refesh (get) profil page information
                        fetch(apiURL + '/user/' + idProfil, options(authCtx))
                            .then((res) => {
                                return res.json();
                            })
                            .then((data) => {
                                //change the state containing the user info
                                setUserInfo(data);
                                // to change the image of the user in state, if its change by user in later function
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
            //async function to await api result to pass to the next step
            //first is to reload authctx information if the user have refresh the page
            //the second is the last seen just before
            async function main() {
                await userConnect(authCtx, navigate, apiURL, setUserInfo);
                await getProfilContent();
            }
            main();
        },
        //the dependancies array waiting changement of Idprofil and uplod of new avatar image to reload
        [isPhotoUploadOpen, idProfil]
    );

    //event function to send new image for the avatar for the user
    let SubmitNewAvatar = async (e) => {
        //create the formdata to send
        let formData = new FormData();
        formData.append('image', photoUpload);

        e.preventDefault();
        //call to the API
        fetch(apiURL + '/user/' + authCtx.id, options(authCtx, 'PUT', formData))
            .then((res) => res.json())
            .then((data) => {
                setIsPhotoUploadOpen(false); //to refresh the profil page to upload the avatar image
            })
            .catch((err) => {
                console.log(err);
            });
    };

    //here, use the bootstrap class to adding style to the component.
    return (
        <>
            <Header />
            <div className='profil-page-container'>
                <UserInfoContainer className=' d-flex align-items-center justify-content-between'>
                    <div>
                        <AvatarImgContainer className='m-3'>
                            <img src={userInfo.imgUrl} className='img-fluid rounded-circle avatar' alt='' />
                        </AvatarImgContainer>
                        <CamContainer>
                            {
                                //ternary operator to let the fontend possibility for user to change the image of the profil (only possible in his own profil)
                                authCtx.id === idProfil ? (
                                    <Cam
                                        className='d-flex justify-content-center align-items-center rounded-circle'
                                        //props to send info to style to change his placement in function of the event just after
                                        open={isPhotoUploadOpen}
                                        onClick={() => {
                                            isPhotoUploadOpen
                                                ? setIsPhotoUploadOpen(false)
                                                : setIsPhotoUploadOpen(true);
                                        }}
                                    >
                                        <i className='fa-solid fa-camera'></i>
                                    </Cam>
                                ) : null
                            }
                            {
                                //ternary operator to let possibility for user to show or not input of uploding new avatar image
                                isPhotoUploadOpen ? (
                                    <FormAvatar
                                        className='d-flex flex-column mt-2 ms-5'
                                        onSubmit={SubmitNewAvatar}
                                    >
                                        <input
                                            type='file'
                                            onChange={(e) => setPhotoUpload(e.target.files[0])}
                                        ></input>
                                        <button
                                            type='submit'
                                            className='btn btn-danger align-self-start mt-3'
                                        >
                                            Changer de photo
                                        </button>
                                    </FormAvatar>
                                ) : null
                            }
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
                            //here send all datas for Content working (props)
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
