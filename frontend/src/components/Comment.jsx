import '../style/style.css';
import styled from 'styled-components';
import { useState, useContext } from 'react';
import { UserAuth } from '../utilis/contextValue.jsx';
import { Link } from 'react-router-dom';

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
    height: 35px;
    position: relative;
    left: -3px;
    background: #ffffff;
    align-self: end;
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
}) {
    const ApiURL = 'http://localhost:' + process.env.REACT_APP_BACKEND_PORT;
    const authCtx = useContext(UserAuth);
    let userLikeArray = authCtx.id;
    const [likes, setLikes] = useState(like);
    const [likeNum, setlikeNum] = useState(usersLike.includes(userLikeArray));
    const [isModifOpen, setIsModifOpen] = useState(false);

    let likingComment = () => {
        const reqOptions = {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + authCtx.token,
            },
        };
        fetch(
            'http://localhost:' + process.env.REACT_APP_BACKEND_PORT + '/comment/' + id + '/like',
            reqOptions
        )
            .then((res) => res.json())
            .then((data) => {
                setlikeNum(data.ContentOrComment.usersLike.users.includes(userLikeArray));
                setLikes(data.ContentOrComment.like);
            })
            .catch((err) => console.log(err));
    };

    function newComment() {
        const reqOptions = {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + authCtx.token,
            },
        };
        fetch(ApiURL + '/' + contentId + '/comment', reqOptions)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setCommentaries(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    let deleteComment = async () => {
        const reqOptions = {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer ' + authCtx.token,
            },
        };
        fetch(ApiURL + '/comment/' + id, reqOptions)
            .then((res) => res.json())
            .then(() => newComment())
            .catch((err) => console.log(err));
    };

    const [modifText, setModifText] = useState(text);

    let uploadComment = async (e) => {
        if (e.key === 'Enter') {
            const reqOptions = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + authCtx.token,
                },
                body: JSON.stringify({ text: modifText }),
            };

            fetch(ApiURL + '/comment/' + id, reqOptions)
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
                        <div
                            className=' border ms-2 p-1 rounded'
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
                        </div>
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
                    {likes <= 0 ? null : (
                        <LikeContainer className='border rounded-pill p-1'>
                            <i
                                className={
                                    (likeNum === true ? 'fa-solid ' : 'fa-regular ') + 'fa-thumbs-up me-1'
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
                                    <div className='dropdown-item' onClick={() => setIsModifOpen(true)}>
                                        modifier
                                    </div>
                                </li>
                                <hr />
                                <li>
                                    <div
                                        className='dropdown-item'
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
                <div className='ms-2' onClick={() => likingComment()}>
                    j'aime
                </div>
            </div>
        </div>
    );
}

export default Comment;
