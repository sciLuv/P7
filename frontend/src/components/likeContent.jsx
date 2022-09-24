import { useState } from 'react';

function ContentLike(likes) {
    let userLikeArray = Number(sessionStorage.getItem('userId'));
    const [like, setLike] = useState(likes.likes);
    const [likeNum, setlikeNum] = useState(likes.usersLike.users.includes(userLikeArray));

    let liking = async () => {
        const reqOptions = {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('auth'),
            },
        };
        fetch(
            'http://localhost:' + process.env.REACT_APP_BACKEND_PORT + '/' + likes.contentId + '/like',
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
        <div
            onClick={() => {
                liking();
            }}
        >
            <i className={(likeNum === true ? 'fa-solid ' : 'fa-regular ') + 'fa-thumbs-up me-1'}></i>
            {like} {like <= 1 ? 'like' : 'likes'}
        </div>
    );
}

export default ContentLike;
