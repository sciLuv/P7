import { useState, useContext } from 'react';
import { UserAuth } from '../utilis/contextValue.jsx';
import options from '../utilis/requestOptions.jsx';
import styled from 'styled-components';

const LikeIcon = styled.i`
    color: #fd2d01;
`;
function ContentLike(likes) {
    const ApiURL = 'http://localhost:' + process.env.REACT_APP_BACKEND_PORT;
    const authCtx = useContext(UserAuth);
    let userLikeArray = authCtx.id;
    const [like, setLike] = useState(likes.likes);
    const [likeNum, setlikeNum] = useState(likes.usersLike.users.includes(userLikeArray));

    let liking = async () => {
        fetch(ApiURL + '/content/' + likes.contentId + '/like', options(authCtx, 'POST'))
            .then((res) => res.json())
            .then((data) => {
                setlikeNum(data.ContentOrComment.usersLike.users.includes(userLikeArray));
                setLike(data.ContentOrComment.like);
            })
            .catch((err) => console.log(err));
    };

    return (
        <div
            onClick={() => {
                liking();
            }}
        >
            <LikeIcon
                className={(likeNum === true ? 'fa-solid ' : 'fa-regular ') + 'fa-thumbs-up me-1 hover-item'}
            ></LikeIcon>
            {like} {like <= 1 ? "j'aime" : "j'aimes"}
        </div>
    );
}

export default ContentLike;
