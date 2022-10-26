//style relative Import
import styled from 'styled-components'; // to stylish component directly in the react file
import StyledGlobalStyle from '../utilis/globalStyle.jsx';
//React and ReactRouter elements's import
import { useState, useContext } from 'react'; //react method to use data in state and context
import { UserAuth } from '../utilis/contextValue.jsx'; //function to put user information to the context of the app
//function
import options from '../utilis/requestOptions.jsx'; //function to manage option of the call of the API

const LikeIcon = styled.i`
    color: #fd2d01;
`;

//manage all things in link with liking interaction
function ContentLike(likes) {
    //Base of URL to get path to the API
    const ApiURL = 'http://localhost:' + process.env.REACT_APP_BACKEND_PORT;

    //actual users informations set in react memory, available everywhere in the app.
    const authCtx = useContext(UserAuth);

    //variable and constants to manage like
    let userLikeArray = authCtx.id;
    const [likeNum, setlikeNum] = useState(likes.usersLike.users.includes(userLikeArray)); //boolean saying if the user have liked the content
    const [like, setLike] = useState(likes.likes); //number of like of the content

    //function to like event
    let liking = async () => {
        //call to the API, to POST the like "status" of the user about the content
        fetch(ApiURL + '/content/' + likes.contentId + '/like', options(authCtx, 'POST'))
            .then((res) => res.json())
            .then((data) => {
                //if the response is sucessful, add new info about like in their associate state
                setlikeNum(data.ContentOrComment.usersLike.users.includes(userLikeArray));
                setLike(data.ContentOrComment.like);
            })
            .catch((err) => console.log(err));
    };

    //here, use the bootstrap class to adding style to the component.
    return (
        <button
            className='btn-neutral'
            aria-label='like du post'
            onClick={() => {
                liking();
            }}
        >
            <LikeIcon
                alt="pouce en l'air"
                className={
                    //if the user like or not the content, we change the class of the HTML elemnt
                    (likeNum === true ? 'fa-solid ' : 'fa-regular ') + 'fa-thumbs-up me-1 hover-item'
                }
            ></LikeIcon>
            {like} {like <= 1 ? "j'aime" : "j'aimes"}
        </button>
    );
}

export default ContentLike;
