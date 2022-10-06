import styled from 'styled-components';
import colors from '../utilis/colors.jsx';
import ContentInteraction from './ContentInteraction.jsx';
import { useContext, useState } from 'react';
import { UserAuth } from '../utilis/contextValue.jsx';
import { Link } from 'react-router-dom';
import options from '../utilis/requestOptions.jsx';
import whiteSpaceVerification from '../utilis/formStringValidation.jsx';

const ContentContainer = styled.article`
    height: 100%;
    width: 100%;
    border: solid ${colors.primary} 2px;
    border-radius: 5px;
`;
const AvatarImgContainer = styled.div`
    height: 45px;
    width: 45px;
`;
const Avatar = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;
const UserName = styled.span`
    color: ${colors.tertiary};
`;
const ContentDate = styled.span`
    font-size: 12px;
`;

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
    const apiURL = 'http://localhost:' + process.env.REACT_APP_BACKEND_PORT;

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

    const authCtx = useContext(UserAuth);
    const [modifContentOpen, setModifContentOpen] = useState(false);
    const [modifText, setModifText] = useState(text);
    const [modifFile, setModifFile] = useState();

    function newContent() {
        let URLtocall = apiURL + '/content';
        if (window.location.href == 'http://localhost:3000/profil') {
            URLtocall = apiURL + '/user/' + userId + '/content';
        }
        fetch(URLtocall, options(authCtx))
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setContentList(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    let deleteContent = async () => {
        fetch(apiURL + '/content/' + contentId, options(authCtx, 'DELETE'))
            .then((res) => res.json())
            .then(() => newContent())
            .catch((err) => console.log(err));
    };

    let uploadContent = async (e) => {
        let modifTextIsCorrect = whiteSpaceVerification(modifText);
        if ((modifTextIsCorrect == true && modifFile == null) || modifFile != null) {
            let formData = new FormData();
            formData.append('content', JSON.stringify({ text: modifText }));
            formData.append('image', modifFile);

            e.preventDefault();
            fetch(apiURL + '/content/' + contentId, options(authCtx, 'PUT', formData))
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    newContent();
                    setModifContentOpen(false);
                })
                .catch((err) => console.log(err));
        }
    };

    return (
        <ContentContainer className='container m-2 p-2 col-3'>
            <div className='d-flex justify-content-between border-bottom border-danger pb-1'>
                <div className='d-flex'>
                    <Link to='/profil' state={userId}>
                        <AvatarImgContainer className='me-2'>
                            <Avatar src={avatar} className='img-fluid rounded-circle' alt='' />
                        </AvatarImgContainer>
                    </Link>
                    <div>
                        <Link to='/profil' state={userId}>
                            <UserName className='d-block fw-bold'>
                                {firstname} {lastname}
                            </UserName>
                        </Link>
                        <ContentDate className='d-block'>{formatedDate}</ContentDate>
                    </div>
                </div>
                {userId === authCtx.id || authCtx.permission === true ? (
                    <div className='btn-group'>
                        <div
                            className='mt-2 me-2'
                            type='button'
                            data-bs-toggle='dropdown'
                            aria-expanded='false'
                        >
                            <i className='fa-solid fa-ellipsis-vertical fa-lg'></i>
                        </div>
                        <ul className='dropdown-menu'>
                            <li>
                                <div className='dropdown-item' onClick={() => setModifContentOpen(true)}>
                                    modifier
                                </div>
                            </li>
                            <hr />
                            <li>
                                <div
                                    className='dropdown-item'
                                    onClick={() => {
                                        deleteContent();
                                    }}
                                >
                                    supprimer
                                </div>
                            </li>
                        </ul>
                    </div>
                ) : null}
            </div>
            {modifContentOpen === true ? (
                <form onSubmit={uploadContent} className='border-bottom border-danger mt-2'>
                    <textarea
                        className='form-control'
                        id='exampleFormControlTextarea1'
                        value={modifText}
                        onChange={(e) => setModifText(e.target.value)}
                        rows='1'
                        placeholder='Quelque chose a partager a vos collegues ?'
                    ></textarea>
                    <div className='d-flex justify-content-between mt-2'>
                        <input type='file' onChange={(e) => setModifFile(e.target.files[0])}></input>
                        <button type='submit' className='btn btn-primary mb-2'>
                            Enregistrer
                        </button>
                    </div>
                </form>
            ) : null}
            <p style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>{text}</p>
            <div>
                <img src={img} className='img-fluid' alt='' />
            </div>
            <ContentInteraction
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
