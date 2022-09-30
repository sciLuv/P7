import { useState, useContext } from 'react';
import { UserAuth } from '../utilis/contextValue.jsx';

function ContentLike(likes) {
    const ApiURL = 'http://localhost:' + process.env.REACT_APP_BACKEND_PORT;
    const authCtx = useContext(UserAuth);
    let userLikeArray = authCtx.id;
    const [like, setLike] = useState(likes.likes);
    const [likeNum, setlikeNum] = useState(likes.usersLike.users.includes(userLikeArray));

    let liking = async () => {
        const reqOptions = {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + authCtx.token,
            },
        };
        fetch(ApiURL + '/content/' + likes.contentId + '/like', reqOptions)
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
            <i className={(likeNum === true ? 'fa-solid ' : 'fa-regular ') + 'fa-thumbs-up me-1'}></i>
            {like} {like <= 1 ? "j'aime" : "j'aimes"}
        </div>
    );
}

export default ContentLike;
