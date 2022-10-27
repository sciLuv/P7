//style relative Import
import styled from 'styled-components'; // to stylish component directly in the react file
import imgRegular from '../assets/image-regular.svg'; //image of the file adding input
import StyledGlobalStyle from '../utilis/globalStyle';
//React and ReactRouter elements's import
import { useEffect, useState, useContext } from 'react'; //react method to use data in state and context
import { UserAuth } from '../utilis/contextValue.jsx'; //function to put user information to the context of the app
import { useNavigate } from 'react-router-dom'; //react-dom method to go to another page
//React component
import Content from '../components/Content.jsx'; //content component
import Header from '../components/Header.jsx'; //header component
//function
import userConnect from '../utilis/reconnexion.jsx'; //call to the API to find again user info with token in sessionStorage
import userInfoSuppr from '../utilis/userInfoSuppr.jsx'; //delete data in session storage
import options from '../utilis/requestOptions.jsx'; //function to manage option of the call of the API
import whiteSpaceVerification from '../utilis/formStringValidation.jsx'; //function to validate the form of text send to the backend

//the css style of the home page
const ContentContainer = styled.div`
    @media (max-width: 576px) {
        margin-left: -7px;
    }
`;
const InputFile = styled.input`
    margin-left: 5px;
    &::file-selector-button {
        cursor: pointer;
        //two rules to remove basic style of the button
        border: none;
        color: rgba(255, 255, 255, 0);
        //two rules to resizing the button
        width: 30px !important;
        height: 30px !important;
        //in function of the props id file change the opacity (in function of selection of the file)
        opacity: ${(props) => (props.isfile ? 1 : 0.2)};
        //image of the button
        background: url(${imgRegular});
    }
`;
const MoreContentButton = styled.button`
    cursor: pointer;
    &:hover {
        background: #e0e0e0 !important;
        color: red;
        transition: 0.3s;
    }
`;

//function in link with all thing happen in the home page
function Home() {
    //base URL of the API
    const apiURL = 'http://localhost:' + process.env.REACT_APP_BACKEND_PORT;

    const [backendPage, setBackendPage] = useState(0);
    const [maxBackendPages, setMaxBackendPages] = useState(0);

    //constants in link with contents show in home page
    const [contentList, setContentList] = useState([]); //state of the content seen in home page
    const [userInfo, setUserInfo] = useState([]); //state of user info using the app

    //constants in link with content adding form
    const [text, setText] = useState(''); //state of text of the new content
    const [file, setFile] = useState(null); //state of image of the new content

    const authCtx = useContext(UserAuth); //context of user info
    //method of react-router allow possibilities to go to another page of the application with link, with no page refreshing
    const navigate = useNavigate();

    sessionStorage.removeItem('lastProfilPageId'); // to remove the sessionStorage data use to show profil page of one user

    //useEffect hook, use here to get content to show in the home page
    //contain two async function who calling API in the main() await function
    //in this wait we waiting the result of the first function and of the API, to call the second
    useEffect(() => {
        async function getContent() {
            //call to the API to get all content to show in home page

            fetch(apiURL + '/content?page=0', options(authCtx))
                .then((res) => {
                    //if the request is failed, we delete information in sessionStorage and lead to login page
                    if (!res.ok) {
                        userInfoSuppr();
                    } else {
                        return res.json();
                    }
                })
                .then((data) => {
                    setBackendPage(backendPage + 1); //sets the next page of content the backend has to send
                    setContentList(data.rows); //updating of the state of the contents to show in home page
                    setMaxBackendPages(Math.ceil(data.count / 10)); //set how many pages of content are now in the backend
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        async function main() {
            await userConnect(authCtx, navigate, apiURL, setUserInfo);
            await getContent();
        }
        main();
    }, []);

    let addingOlderContent = async (e) => {
        async function getContent() {
            //call to the API to get all content to show in home page
            fetch(apiURL + '/content?page=' + backendPage, options(authCtx))
                .then((res) => {
                    //if the request is failed, we delete information in sessionStorage and lead to login page
                    if (!res.ok) {
                        userInfoSuppr();
                    } else {
                        return res.json();
                    }
                })
                .then((data) => {
                    setBackendPage(backendPage + 1);
                    setContentList(contentList.concat(data.rows)); //updating of the state of the contents to show in home page
                    setMaxBackendPages(Math.ceil(data.count / 10)); //set how many pages of content are now in the backend
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        getContent();
    };

    //Event function to adding content (in link with form)
    let handleSubmit = async (e) => {
        //here verification of the validity of the form send
        //verification of whitespace and presence of file
        let newTextIsCorrect = whiteSpaceVerification(text);
        if ((newTextIsCorrect === true && file == null) || file != null) {
            //create formdata to send
            let formData = new FormData();
            formData.append('content', JSON.stringify({ text: text }));
            formData.append('image', file);

            e.preventDefault();
            //call to the API to send new content to the backend
            fetch(apiURL + '/content', options(authCtx, 'POST', formData))
                .then((res) => res.json())
                .then((data) => {
                    //if the call to the API is successful :
                    setBackendPage(1); //sets the next page of content the backend has to send
                    setContentList(data.rows); //updating of the state of the contents to show in home page
                    setMaxBackendPages(Math.ceil(data.count / 10)); //set how many pages of content are now in the backend
                    //emptying inputs of form
                    setFile(null);
                    setText('');
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    //here, use the bootstrap class to adding style to the component.
    return (
        <>
            <Header />
            <ContentContainer className='container'>
                <div className='container m-2 p-2  col-12 d-flex justify-content-center'>
                    <div className='me-2 avatarImgContainer'>
                        <img src={userInfo.imgUrl} className='img-fluid rounded-circle avatar' alt='' />
                    </div>
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
                                //to send info to the style in function of the state of file selection
                                isfile={file === null ? false : true}
                                //event to add file to the state containing it
                                onChange={(e) => {
                                    setFile(e.target.files[0]);
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
                            contentList={contentList}
                            setContentList={setContentList}
                        />
                    ))}
                </section>
                <div className='d-flex justify-content-center m-3'>
                    {maxBackendPages === backendPage ? null : (
                        <MoreContentButton
                            className='rounded rounded p-2 bg-white btn-neutral'
                            onClick={(e) => addingOlderContent()}
                        >
                            <i className='fa-solid fa-rotate-right'></i>
                            <span> charger les posts plus anciens...</span>
                        </MoreContentButton>
                    )}
                </div>
            </ContentContainer>
        </>
    );
}

export default Home;
