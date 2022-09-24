import styled from 'styled-components';

const AvatarImgContainer = styled.div`
    height: 40px;
`;
const Avatar = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

function Comment(comment) {
    return (
        <div className='d-flex m-2'>
            <AvatarImgContainer className='me-1'>
                <Avatar src={comment.img} className='img-fluid rounded-circle' alt='' />
            </AvatarImgContainer>
            <div>
                <div className=' border ms-2 p-1 rounded'>
                    <div className='fw-bold'>
                        {comment.firstname} {comment.lastname}
                    </div>
                    <div>{comment.text}</div>
                </div>
                <div className='ms-2'>j'aime</div>
            </div>
        </div>
    );
}

export default Comment;
