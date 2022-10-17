//style relative Import
import styled from 'styled-components'; // to stylish component directly in the react file
//React and ReactRouter elements's import
import { useState, useContext } from 'react'; //react method to use data in state and context
import { UserAuth } from '../utilis/contextValue.jsx'; //function to put user information to the context of the app
import { Link } from 'react-router-dom'; //react-dom method to go to another page
//function
import options from '../utilis/requestOptions.jsx'; //function to manage option of the call of the API
import whiteSpaceVerification from '../utilis/formStringValidation'; //function to validate the form of text send to the backend

//the css style of the home page
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

//function in link with comment upload, delete and liking
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
    //base URL of the API
    const apiURL = 'http://localhost:' + process.env.REACT_APP_BACKEND_PORT;

    //actual users informations set in react memory, available everywhere in the app.
    const authCtx = useContext(UserAuth);

    //constants and variable in link with like working
    let userLikeArray = authCtx.id;
    const [likes, setLikes] = useState(like); //number of likes of the comment
    const [likeNum, setlikeNum] = useState(usersLike.includes(userLikeArray)); //if the user have liked the comment

    //constants in link with comment modification
    const [isModifOpen, setIsModifOpen] = useState(false); //to open interface of modification of the comment
    const [modifText, setModifText] = useState(text); //state of modified text to upload

    //to liking a comment or remove his like from a comment
    let likingComment = () => {
        //call to the API to adding/remove like from one comment
        fetch(
            'http://localhost:' + process.env.REACT_APP_BACKEND_PORT + '/comment/' + id + '/like',
            options(authCtx, 'POST')
        )
            .then((res) => res.json())
            .then((data) => {
                //change state const in link with the likes after the sending of the like info
                setlikeNum(data.ContentOrComment.usersLike.users.includes(userLikeArray));
                setLikes(data.ContentOrComment.like);
            })
            .catch((err) => console.log(err));
    };

    //to refresh comments of a specific content when user change one of his comment
    function newComment() {
        //call of the API to have all comments from one content
        fetch(apiURL + '/' + contentId + '/comment', options(authCtx))
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setCommentaries(data); //load comment send by the API after adding change to one comment in the DB
                setCommentNum(data.length); //to refresh the number in the top of the comment section of the content
            })
            .catch((err) => {
                console.log(err);
            });
    }

    //to delete one comment
    let deleteComment = async () => {
        //call of the APO to delete one comment
        fetch(apiURL + '/comment/' + id, options(authCtx, 'DELETE'))
            .then((res) => res.json())
            .then(() => {
                newComment();
            })
            .catch((err) => console.log(err));
    };

    //to upload comment
    let uploadComment = async (e) => {
        let modifTextIsCorrect = whiteSpaceVerification(modifText);
        //if the user push enter key, dont push shift key and if the string have not only whitespace and linebreak
        if (e.key === 'Enter' && modifTextIsCorrect === true && e.shiftKey === false) {
            let body = JSON.stringify({ text: modifText });
            fetch(apiURL + '/comment/' + id, options(authCtx, 'PUT', body, 'application/json'))
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    setIsModifOpen(false); //to close interface of the comment modification
                    newComment(); //refreshing the comment list with the function seen before
                })
                .catch((err) => console.log(err));
        }
    };

    //here, use the bootstrap class to adding style to the component.
    return (
        <div className='d-flex m-2'>
            <Link to='/profil' state={userId}>
                <div className='me-1 avatarImgContainer'>
                    <img src={img} className='img-fluid rounded-circle avatar' alt='' />
                </div>
            </Link>
            <div>
                <div className='d-flex comment'>
                    {
                        //to show or not info of the comment, if user currently using the modification interaction
                        isModifOpen === false ? (
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
                        ) : null
                    }

                    {
                        //to show or not the interface of comment modification
                        isModifOpen === true ? (
                            <form className='col-12 mt-1' onKeyPress={uploadComment}>
                                <textarea
                                    className='form-control'
                                    id='exampleFormControlTextarea1'
                                    //in link with the state of the modifying text to send
                                    value={modifText}
                                    //Event to change the text of his own comment
                                    onChange={(e) => {
                                        setModifText(e.target.value);
                                    }}
                                    rows='1'
                                    placeholder='donnez votre avis sur cette publication !'
                                ></textarea>{' '}
                            </form>
                        ) : null
                    }
                    {
                        //show or not like icon, if there are like and if the user change currently the comment
                        likes <= 0 || isModifOpen === true ? null : (
                            <LikeContainer className='rounded-pill'>
                                <i
                                    className={
                                        //change the classname of the HTML element in function if the user have liked or not the comment
                                        (likeNum === true ? 'fa-solid ' : 'fa-regular ') +
                                        'fa-thumbs-up me-1 rounded-pill p-1'
                                    }
                                ></i>
                                <span className='me-1'>{likes}</span>
                            </LikeContainer>
                        )
                    }
                    {
                        //show or not the btn openning the modification comment interface
                        userId === authCtx.id || authCtx.permission === true ? (
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
                                            //event to openning the modification comment interface
                                            onClick={() => setIsModifOpen(true)}
                                        >
                                            modifier
                                        </div>
                                    </li>
                                    <hr />
                                    <li>
                                        <div
                                            className='dropdown-item hover-item'
                                            //evetn to delete comment
                                            onClick={() => {
                                                deleteComment();
                                            }}
                                        >
                                            supprimer
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        ) : null
                    }
                </div>
                {
                    //in function if the modification comment interface is open, show btn to cancel the modification, or the like btn
                    isModifOpen === true ? (
                        <div className='ms-2 hover-item' onClick={() => setIsModifOpen(false)}>
                            annuler
                        </div>
                    ) : (
                        <div className='ms-2 hover-item' onClick={() => likingComment()}>
                            j'aime
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default Comment;
