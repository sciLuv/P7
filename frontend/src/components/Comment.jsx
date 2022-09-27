import styled from 'styled-components';
import colors from '../utilis/colors.jsx';
import { useState, useContext } from 'react';
import { UserAuth } from '../utilis/contextValue.jsx';
import '../style/style.css';

const AvatarImgContainer = styled.div`
    height: 40px;
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

function Comment(comment) {
    console.log('COMMENT');
    console.log(comment);
    const authCtx = useContext(UserAuth);
    let userLikeArray = authCtx.id;
    const [like, setLike] = useState(comment.like);
    const [likeNum, setlikeNum] = useState(comment.usersLike.includes(userLikeArray));

    let likingComment = () => {
        const reqOptions = {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + authCtx.token,
            },
        };
        fetch(
            'http://localhost:' + process.env.REACT_APP_BACKEND_PORT + '/comment/' + comment.id + '/like',
            reqOptions
        )
            .then((res) => res.json())
            .then((data) => {
                setlikeNum(data.ContentOrComment.usersLike.users.includes(userLikeArray));
                setLike(data.ContentOrComment.like);
            })
            .catch((err) => console.log(err));
    };

    return (
        <div className='d-flex m-2'>
            <AvatarImgContainer className='me-1'>
                <Avatar src={comment.img} className='img-fluid rounded-circle' alt='' />
            </AvatarImgContainer>
            <div>
                <div className='d-flex comment'>
                    <div className=' border ms-2 p-1 rounded'>
                        <div className='fw-bold'>
                            {comment.firstname} {comment.lastname}
                        </div>
                        <div>{comment.text}</div>
                    </div>
                    {like <= 0 ? null : (
                        <LikeContainer className='border rounded-pill p-1'>
                            <i
                                className={
                                    (likeNum === true ? 'fa-solid ' : 'fa-regular ') + 'fa-thumbs-up me-1'
                                }
                            ></i>
                            <span className='me-1'>{like}</span>
                        </LikeContainer>
                    )}
                    {comment.userId === authCtx.id || authCtx.permission === true ? (
                        <i class='fa-solid fa-ellipsis fa-2x ms-3 align-self-center'></i>
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
