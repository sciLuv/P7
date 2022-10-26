//style relative Import
import styled from 'styled-components'; // to stylish component directly in the react file
import StyledGlobalStyle from '../utilis/globalStyle.jsx';
//React and ReactRouter elements's import
import { useState, useContext, useEffect } from 'react'; //react method to use data in state and context
import { UserAuth } from '../utilis/contextValue.jsx'; //function to put user information to the context of the app
//React component
import Comment from './Comment'; //comment component
import ContentLike from './likeContent'; //contentLike component
//function
import options from '../utilis/requestOptions.jsx'; //function to manage option of the call of the API
import whiteSpaceVerification from '../utilis/formStringValidation'; //function to validate the form of text send to the backend

const CommentIcon = styled.i`
    color: #fd2d01;
`;

//function in link with all thing in link with comment of one content
function ContentInteraction({ likes, comments, contentId, usersLike }) {
    //base URL of the API
    const ApiURL = 'http://localhost:' + process.env.REACT_APP_BACKEND_PORT;

    //state in link with comment add and show
    const [commentaries, setCommentaries] = useState([]); //array contain comments and their relative information
    const [newComment, setNewComment] = useState(''); //state contain text to send for a new comment

    //state in link with comment interface interaction
    const [isCommentOpen, setIsCommentOpen] = useState(false); //open or close comment space
    const [commentNum, setCommentNum] = useState(comments.length); //change the comment number of the text of the opener button of the comment space

    //actual users informations set in react memory, available everywhere in the app.
    const authCtx = useContext(UserAuth);

    //JS représentation of the HTML input text to send a new comment
    let addCommentInput = document.getElementById('comment-input');

    //close all comment space when refesh the page or change the avatar image in the profil page
    useEffect(() => {
        setIsCommentOpen(false);
    }, [authCtx.img]);

    //Event function to send Comment of the content when user press enter
    let handlePressKey = async (e) => {
        //here verification of the validity of the body send
        //verification of whitespace and the no pressof the shift key
        let newCommentIsCorrect = whiteSpaceVerification(newComment);
        if (e.key === 'Enter' && newCommentIsCorrect == true && e.shiftKey == false) {
            //create the body to send to the API
            let body = JSON.stringify({
                text: newComment,
            });
            //call to the API to POSt the new comment
            fetch(ApiURL + '/' + contentId + '/comment', options(authCtx, 'POST', body, 'application/json'))
                .then((res) => res.json())
                .then((data) => {
                    //if the response is successfull, array of all the comment relative of the content is send
                    setCommentaries(data.comments); //change the state in link with all comment with new array
                    setCommentNum(data.comments.length); //change the state of the number of element

                    //reset to initial the input of writing comment
                    setNewComment('');
                    addCommentInput.blur();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    //find all comments of one content
    function openComment() {
        if (isCommentOpen === false) {
            setIsCommentOpen(true); //open the comment space of the content
            //call to the API to get all comment to show in link with one content
            fetch(ApiURL + '/' + contentId + '/comment', options(authCtx))
                .then((res) => res.json())
                .then((data) => {
                    setCommentaries(data); //add all comment in link with one content in the state associate
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            setIsCommentOpen(false);
        }
    }

    //here, use the bootstrap class to adding style to the component.
    return (
        <>
            <div className='d-flex border-top justify-content-between'>
                <ContentLike likes={likes} usersLike={usersLike} contentId={contentId} />

                <button
                    onClick={openComment}
                    className='hover-item btn-neutral'
                    tabIndex='0'
                    aria-label='ouverture des commentaires'
                >
                    <CommentIcon
                        className='fa-regular fa-comment me-1'
                        alt='bulle de bande dessinée'
                    ></CommentIcon>
                    {commentNum} {commentNum <= 1 ? 'commentaire' : 'commentaires'}
                </button>
            </div>
            {
                //if the comment space is open
                isCommentOpen ? (
                    <div className='border-top mt-2 '>
                        {commentaries.map((comment) => (
                            //here send all datas for comment working (props)
                            <Comment
                                key={'comment ' + comment.id}
                                text={comment.text}
                                id={comment.id}
                                firstname={comment.user.firstname}
                                lastname={comment.user.lastname}
                                img={comment.user.imgUrl}
                                like={comment.like}
                                usersLike={comment.usersLike.users}
                                userId={comment.userId}
                                contentId={comment.contentId}
                                commentaries={commentaries}
                                setCommentaries={setCommentaries}
                                setCommentNum={setCommentNum}
                                commentNum={commentNum}
                            />
                        ))}

                        <form className='col-12 mt-1' onKeyPress={handlePressKey}>
                            <textarea
                                className='form-control'
                                id='comment-input'
                                rows='1'
                                placeholder='donnez votre avis sur cette publication !'
                                //value associate to the state of the new comment
                                value={newComment}
                                //event to change the state of the new comment
                                onChange={(e) => setNewComment(e.target.value)}
                            ></textarea>{' '}
                        </form>
                    </div>
                ) : null
            }
        </>
    );
}

export default ContentInteraction;
