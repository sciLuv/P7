//style relative Import
import styled from 'styled-components'; // to stylish component directly in the react file
import imgRegular from '../assets/image-regular.svg'; //the input img btn
import colors from '../utilis/colors.jsx'; //CSS colors value
import StyledGlobalStyle from '../utilis/globalStyle';
//React and ReactRouter elements's import
import { useContext, useState } from 'react'; //react method to use data in state and context
import { UserAuth } from '../utilis/contextValue.jsx'; //function to put user information to the context of the app
import { Link } from 'react-router-dom'; //react-dom method to go to another page
//function
import ContentInteraction from './ContentInteraction.jsx';
import options from '../utilis/requestOptions.jsx'; //function to manage option of the call of the API
import whiteSpaceVerification from '../utilis/formStringValidation.jsx'; //function to validate the form of text send to the backend

//style for the content
const ContentContainer = styled.article`
    height: 100%;
    width: 100%;
    border-radius: 5px;
`;
const UserName = styled.span`
    color: ${colors.tertiary};
`;
const ContentDate = styled.span`
    font-size: 12px;
`;

const ContentTextandImg = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;
const ImgContent = styled.div`
    display: flex;
    width: 100%;
    & div {
        width: 100%;
        height: height;
    }
    & .left-size {
        background: linear-gradient(90deg, rgba(255, 255, 255, 0) 40%, #4e516617 100%);
    }
    & .right-size {
        background: linear-gradient(-90deg, rgba(255, 255, 255, 0) 40%, #4e516617 100%);
    }
    & img {
        max-height: 500px;
    }
`;
const TextContent = styled.p`
    width: 100%;
    padding-bottom: 0px;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    margin-left: 5px;
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
//function in link with modification and suppression of content
function Content({
    firstname,
    lastname,
    avatar,
    date,
    text,
    img,
    comments,
    like,
    usersLike,
    contentId,
    userId,
    contentList,
    setContentList,
}) {
    //base URL of the API
    const apiURL = 'http://localhost:' + process.env.REACT_APP_BACKEND_PORT;

    //serveDate, time, formatedTime, optionsDate, formatedDate are use to formated date of the backend to a french format
    let servDate = date.split('T').join(' ').split('.000Z').join('');
    let time = servDate.split(/[- :]/);
    var formatedTime = new Date(Date.UTC(time[0], time[1] - 1, time[2], time[3], time[4], time[5]));
    const optionsDate = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };
    let formatedDate = formatedTime.toLocaleDateString(process.env.REACT_APP_LOCAL_DATE, optionsDate);

    /* ---------------------------------------------------------------------------------------------------------- */

    //actual users informations set in react memory, available everywhere in the app.
    const authCtx = useContext(UserAuth);

    //constants represant image and text, to change them when user upload news
    const [textContent, setText] = useState(text); //text send by the backend
    const [imgContent, setImg] = useState(img); //image send by the backend

    //constants in link with content new information (to upload)
    const [modifText, setModifText] = useState(text); //new text to send to the backend
    const [modifFile, setModifFile] = useState(null); //new image to send to the backend

    //to open interface of modification of the content
    const [modifContentOpen, setModifContentOpen] = useState(false);

    //delete the content
    let deleteContent = async () => {
        //call to the API to delete one content
        fetch(apiURL + '/content/' + contentId, options(authCtx, 'DELETE'))
            .then((res) => res.json())
            //to refresh the page after deletion
            .then(() => {
                //to find the element to delete in the contentList
                let contentToDelete = contentList.findIndex((element) => element.id === contentId);
                //create new array of content to set in after in setContentList
                let newContentList = contentList.slice();
                newContentList.splice(contentToDelete, 1);

                setContentList(newContentList);
            })
            .catch((err) => console.log(err));
    };

    //upload the content
    let uploadContent = async (e) => {
        //here verification of the validity of the form send
        //verification of whitespace and presence of file
        let modifTextIsCorrect = whiteSpaceVerification(modifText);
        if ((modifTextIsCorrect === true && modifFile == null) || modifFile != null) {
            //create form data to send
            let formData = new FormData();
            formData.append('content', JSON.stringify({ text: modifText }));
            formData.append('image', modifFile);

            e.preventDefault();
            //call to the API to send changed content to the backend
            fetch(apiURL + '/content/' + contentId, options(authCtx, 'PUT', formData))
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    setImg(data.imgUrl);
                    setText(data.text);
                    //if the call to the API is successful :
                    /* newContent(); //refreshing the page after uploading */
                    setModifContentOpen(false); //close the interface of modification
                })
                .catch((err) => console.log(err));
        }
    };

    //here, use the bootstrap class to adding style to the component.
    return (
        <ContentContainer className='container m-2 p-2 bg-white'>
            <div className='d-flex justify-content-between pb-1'>
                <div className='d-flex'>
                    <Link to='/profil' state={userId} aria-label={'profil de ' + firstname + ' ' + lastname}>
                        <div className='me-2 avatarImgContainer'>
                            <img
                                src={avatar}
                                className='img-fluid rounded-circle avatar'
                                alt={'avatar de ' + firstname + ' ' + lastname}
                            />
                        </div>
                    </Link>
                    <div>
                        <Link
                            to='/profil'
                            state={userId}
                            aria-label={'profil de ' + firstname + ' ' + lastname}
                        >
                            <UserName className='d-block fw-bold'>
                                {firstname} {lastname}
                            </UserName>
                        </Link>
                        <ContentDate className='d-block'>{formatedDate}</ContentDate>
                    </div>
                </div>
                {
                    //ternary operator to let the fontend possibility for user to change the content (only possible if its his own content)
                    userId === authCtx.id || authCtx.permission === true ? (
                        <div className='btn-group'>
                            <button
                                className='mt-2 me-2 btn-neutral'
                                type='button'
                                data-bs-toggle='dropdown'
                                aria-expanded='false'
                                aria-label="bouton d'option du post"
                            >
                                <i className='fa-solid fa-ellipsis-vertical fa-lg'></i>
                            </button>
                            <ul className='dropdown-menu'>
                                <li>
                                    <button
                                        className='dropdown-item'
                                        aria-label='modification du post'
                                        tabIndex='0'
                                        //event to open interface of modification
                                        onClick={() => setModifContentOpen(true)}
                                    >
                                        modifier
                                    </button>
                                </li>
                                <hr />
                                <li>
                                    <button
                                        className='dropdown-item btn-neutral'
                                        tabIndex='0'
                                        //event to delete content
                                        onClick={() => {
                                            deleteContent();
                                        }}
                                    >
                                        supprimer
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : null
                }
            </div>

            {
                //ternary operator to let the fontend possibility for user to change the content (only possible if its his own content)
                modifContentOpen === true ? (
                    <form onSubmit={uploadContent} className='mt-2'>
                        <textarea
                            className='form-control'
                            id='exampleFormControlTextarea1'
                            //in link with the state of the modifying text to send
                            value={modifText}
                            //Event to modify state value of text for modification of the content
                            onChange={(e) => setModifText(e.target.value)}
                            rows='1'
                            placeholder='Quelque chose a partager a vos collegues ?'
                        ></textarea>
                        <div className='d-flex justify-content-between mt-2'>
                            <InputFile
                                type='file'
                                //props to send info to style of the button of input of adding file, to give feedback to the user
                                isfile={modifFile === null ? false : true}
                                //Event to modify state value of text for modification of the content
                                onChange={(e) => setModifFile(e.target.files[0])}
                            ></InputFile>
                            <button type='submit' className='btn btn-danger mb-2'>
                                Enregistrer
                            </button>
                        </div>
                    </form>
                ) : (
                    <ContentTextandImg>
                        <TextContent>{textContent}</TextContent>
                        {img == null ? null : (
                            <ImgContent className={text.length > 0 ? 'border-top' : null}>
                                <div className='left-size'></div>
                                <img
                                    src={imgContent}
                                    className='img-fluid'
                                    alt={
                                        'image du post de' +
                                        firstname +
                                        ' ' +
                                        lastname +
                                        ' à la date du ' +
                                        formatedDate
                                    }
                                />
                                <div className='right-size'></div>
                            </ImgContent>
                        )}
                    </ContentTextandImg>
                )
            }

            <ContentInteraction
                //here all information send to the contentInteraction component for its operation
                key={contentId}
                likes={like}
                comments={comments}
                contentId={contentId}
                usersLike={usersLike}
            />
        </ContentContainer>
    );
}

export default Content;
