//style relative Import
import styled from 'styled-components';
import imgRegular from '../assets/image-regular.svg';
//React and ReactRouter elements's import
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../utilis/contextValue.jsx';
//function and React component import
import Content from '../components/Content.jsx';
import Header from '../components/Header.jsx';
import userConnect from '../utilis/reconnection.jsx';
import userInfoSuppr from '../utilis/userInfoSuppr.jsx';
import options from '../utilis/requestOptions.jsx';
import whiteSpaceVerification from '../utilis/formStringValidation.jsx';

const AvatarImgContainer = styled.div`
    height: 45px;
    min-height: 45px;
    width: 45px;
    min-width: 45px;
`;
const Avatar = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;
const ContentContainer = styled.div`
    @media (max-width: 576px) {
        margin-left: -7px;
    }
`;

const InputFile = styled.input`
    margin-left: 5px;
    &::file-selector-button {
        width: 30px !important;
        height: 30px !important;
        opacity: 0;
    }
    &::before {
        width: 30px !important;
        height: 30px !important;
        content: '';
        position: absolute;
        z-index: 5;
        border-radius: 5px;
        opacity: ${(props) => (props.isfile ? 1 : 0.2)};
        background: url(${imgRegular});
        cursor: pointer;
    }
`;

function Home() {
    const ApiURL = 'http://localhost:' + process.env.REACT_APP_BACKEND_PORT;
    const [contentList, setContentList] = useState([]);
    const [userInfo, setUserInfo] = useState([]);
    const navigate = useNavigate();
    const authCtx = useContext(UserAuth);

    sessionStorage.removeItem('lastProfilPageId');
    console.log(userInfo);
    console.log(authCtx);

    useEffect(() => {
        async function getContent() {
            fetch(ApiURL + '/content', options(authCtx))
                .then((res) => {
                    if (!res.ok) {
                        userInfoSuppr();
                    } else {
                        return res.json();
                    }
                })
                .then((data) => {
                    console.log(data);
                    setContentList(data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        async function main() {
            await userConnect(authCtx, navigate, ApiURL, setUserInfo);
            await getContent();
        }
        main();
    }, []);

    //les constantes liées au form d'ajout de contenu
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);

    let handleSubmit = async (e) => {
        let newTextIsCorrect = whiteSpaceVerification(text);
        if ((newTextIsCorrect == true && file == null) || file != null) {
            let formData = new FormData();
            formData.append('content', JSON.stringify({ text: text }));
            formData.append('image', file);

            e.preventDefault();
            fetch(ApiURL + '/content', options(authCtx, 'POST', formData))
                .then((res) => res.json())
                .then((data) => {
                    setContentList(data);
                    setFile(null);
                    setText('');
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    return (
        <>
            <Header />
            <ContentContainer className='container'>
                <div className='container m-2 p-2  col-12 d-flex justify-content-center'>
                    <AvatarImgContainer className='me-2'>
                        <Avatar src={userInfo.imgUrl} className='img-fluid rounded-circle' alt='' />
                    </AvatarImgContainer>
                    <form onSubmit={handleSubmit} className='col-md-11 col-10'>
                        <textarea
                            className='form-control'
                            id='exampleFormControlTextarea1'
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows='1'
                            placeholder='Quelque chose a partager a vos collegues ?'
                        ></textarea>
                        <div className='d-flex justify-content-between mt-2'>
                            <InputFile
                                type='file'
                                isfile={file === null ? false : true}
                                onChange={(e) => {
                                    setFile(e.target.files[0]);
                                    console.log(file);
                                }}
                            ></InputFile>
                            <button type='submit' className='btn btn-danger'>
                                Publier
                            </button>
                        </div>
                    </form>
                </div>

                <section>
                    {contentList.map((content) => (
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
                            contentList={contentList}
                            setContentList={setContentList}
                        />
                    ))}
                </section>
            </ContentContainer>
        </>
    );
}

export default Home;
