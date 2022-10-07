import '../style/style.css';
import styled from 'styled-components';
import { useState, useContext } from 'react';
import { UserAuth } from '../utilis/contextValue.jsx';
import { Link } from 'react-router-dom';
import options from '../utilis/requestOptions.jsx';
import whiteSpaceVerification from '../utilis/formStringValidation';

const AvatarImgContainer = styled.div`
    height: 40px;
    width: 45px;
`;
const Avatar = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;
const LikeContainer = styled.div`
    display: inline;
    height: 24px;
    position: relative;
    left: -3px;
    background: #f2f2f2;
    align-self: end;
    white-space: nowrap;
    & i {
        background-color: #ffd7d7;
        color: #fd2d01;
    }
`;
const CommentText = styled.div`
    background: #eaeaea;
`;

function Comment({
    text,
    id,
    firstname,
    lastname,
    img,
    like,
    usersLike,
    userId,
    contentId,
    commentaries,
    setCommentaries,
    setCommentNum,
    commentNum,
}) {
    const ApiURL = 'http://localhost:' + process.env.REACT_APP_BACKEND_PORT;
    const authCtx = useContext(UserAuth);
    let userLikeArray = authCtx.id;
    const [likes, setLikes] = useState(like);
    const [likeNum, setlikeNum] = useState(usersLike.includes(userLikeArray));
    const [isModifOpen, setIsModifOpen] = useState(false);

    let likingComment = () => {
        fetch(
            'http://localhost:' + process.env.REACT_APP_BACKEND_PORT + '/comment/' + id + '/like',
            options(authCtx, 'POST')
        )
            .then((res) => res.json())
            .then((data) => {
                setlikeNum(data.ContentOrComment.usersLike.users.includes(userLikeArray));
                setLikes(data.ContentOrComment.like);
            })
            .catch((err) => console.log(err));
    };

    function newComment() {
        fetch(ApiURL + '/' + contentId + '/comment', options(authCtx))
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setCommentaries(data);
                setCommentNum(data.length);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    let deleteComment = async () => {
        fetch(ApiURL + '/comment/' + id, options(authCtx, 'DELETE'))
            .then((res) => res.json())
            .then(() => {
                newComment();
            })
            .catch((err) => console.log(err));
    };

    const [modifText, setModifText] = useState(text);

    let uploadComment = async (e) => {
        let modifTextIsCorrect = whiteSpaceVerification(modifText);
        //if the user push enter key, dont push shift key and if the string have not only whitespace and linebreak
        if (e.key === 'Enter' && modifTextIsCorrect == true && e.shiftKey == false) {
            let body = JSON.stringify({ text: modifText });
            fetch(ApiURL + '/comment/' + id, options(authCtx, 'PUT', body, 'application/json'))
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    setIsModifOpen(false);
                    newComment();
                })
                .catch((err) => console.log(err));
        }
    };

    return (
        <div className='d-flex m-2'>
            <Link to='/profil' state={userId}>
                <AvatarImgContainer className='me-1'>
                    <Avatar src={img} className='img-fluid rounded-circle' alt='' />
                </AvatarImgContainer>
            </Link>
            <div>
                <div className='d-flex comment'>
                    {isModifOpen === false ? (
                        <CommentText
                            className='ms-2 p-1 rounded'
                            style={{
                                whiteSpace: 'pre-wrap',
                                overflowWrap: 'break-word',
                            }}
                        >
                            <Link to='/profil' state={userId}>
                                <div className='fw-bold'>
                                    {firstname} {lastname}
                                </div>
                            </Link>

                            <span>{text}</span>
                        </CommentText>
                    ) : null}

                    {isModifOpen === true ? (
                        <form className='col-12 mt-1' onKeyPress={uploadComment}>
                            <textarea
                                className='form-control'
                                id='exampleFormControlTextarea1'
                                value={modifText}
                                onChange={(e) => {
                                    setModifText(e.target.value);
                                }}
                                rows='1'
                                placeholder='donnez votre avis sur cette publication !'
                            ></textarea>{' '}
                        </form>
                    ) : null}
                    {likes <= 0 || isModifOpen === true ? null : (
                        <LikeContainer className='rounded-pill'>
                            <i
                                className={
                                    (likeNum === true ? 'fa-solid ' : 'fa-regular ') +
                                    'fa-thumbs-up me-1 rounded-pill p-1'
                                }
                            ></i>
                            <span className='me-1'>{likes}</span>
                        </LikeContainer>
                    )}
                    {userId === authCtx.id || authCtx.permission === true ? (
                        <div className='btn-group'>
                            <div
                                className='mt-2 me-2'
                                type='button'
                                data-bs-toggle='dropdown'
                                aria-expanded='false'
                            >
                                <i className='fa-solid fa-ellipsis fa-2x ms-3 align-self-center'></i>
                            </div>
                            <ul className='dropdown-menu'>
                                <li>
                                    <div
                                        className='dropdown-item hover-item'
                                        onClick={() => setIsModifOpen(true)}
                                    >
                                        modifier
                                    </div>
                                </li>
                                <hr />
                                <li>
                                    <div
                                        className='dropdown-item hover-item'
                                        onClick={() => {
                                            deleteComment();
                                        }}
                                    >
                                        supprimer
                                    </div>
                                </li>
                            </ul>
                        </div>
                    ) : null}
                </div>
                {isModifOpen === true ? (
                    <div className='ms-2 hover-item' onClick={() => setIsModifOpen(false)}>
                        annuler
                    </div>
                ) : (
                    <div className='ms-2 hover-item' onClick={() => likingComment()}>
                        j'aime
                    </div>
                )}
            </div>
        </div>
    );
}

export default Comment;
