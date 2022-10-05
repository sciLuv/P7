import { useState, useContext, useEffect } from 'react';
import Comment from './Comment';
import ContentLike from './likeContent';
import { UserAuth } from '../utilis/contextValue.jsx';
import options from '../utilis/requestOptions.jsx';
import whiteSpaceVerification from '../utilis/formStringValidation';

function ContentInteraction({ likes, comments, contentId, usersLike }) {
    const ApiURL = 'http://localhost:' + process.env.REACT_APP_BACKEND_PORT;

    const [commentaries, setCommentaries] = useState([]);
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [newComment, setNewComment] = useState('');
    //to
    const [commentNum, setCommentNum] = useState(comments.length);

    const authCtx = useContext(UserAuth);

    let addCommentInput = document.getElementById('comment-input');

    useEffect(() => {
        setIsCommentOpen(false);
    }, [authCtx.img]);

    let handlePressKey = async (e) => {
        let newCommentIsCorrect = whiteSpaceVerification(newComment);
        //if the user push enter key, dont push shift key and if the string have not only whitespace and linebreak
        if (e.key === 'Enter' && newCommentIsCorrect == true && e.shiftKey == false) {
            let body = JSON.stringify({
                text: newComment,
            });
            fetch(ApiURL + '/' + contentId + '/comment', options(authCtx, 'POST', body, 'application/json'))
                .then((res) => res.json())
                .then((data) => {
                    setCommentaries(data.comments);
                    setCommentNum(data.comments.length);
                    setNewComment('');
                    addCommentInput.blur();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    function openComment() {
        if (isCommentOpen === false) {
            setIsCommentOpen(true);
            fetch(ApiURL + '/' + contentId + '/comment', options(authCtx))
                .then((res) => res.json())
                .then((data) => {
                    setCommentaries(data);
                    console.log(data);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            setIsCommentOpen(false);
        }
    }

    return (
        <>
            <div className='d-flex border-top border-danger mt-2 justify-content-between'>
                <ContentLike likes={likes} usersLike={usersLike} contentId={contentId} />

                <div onClick={openComment}>
                    <i className='fa-regular fa-comment me-1'></i>
                    {commentNum} commentaire(s)
                </div>
            </div>
            {isCommentOpen ? (
                <div className='border-top border-danger mt-2 '>
                    {commentaries.map((comment) => (
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
                        />
                    ))}

                    <form className='col-12 mt-1' onKeyPress={handlePressKey}>
                        <textarea
                            className='form-control'
                            id='comment-input'
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            rows='1'
                            placeholder='donnez votre avis sur cette publication !'
                        ></textarea>{' '}
                    </form>
                </div>
            ) : null}
        </>
    );
}

export default ContentInteraction;
