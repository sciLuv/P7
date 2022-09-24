import styled from 'styled-components';
import colors from '../utilis/colors.jsx';
import ContentInteraction from './ContentInteraction.jsx';

const ContentContainer = styled.article`
    height: 100%;
    width: 100%;
    border: solid ${colors.primary} 2px;
    border-radius: 5px;
`;
const AvatarImgContainer = styled.div`
    height: 40px;
`;
const Avatar = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;
const UserName = styled.span`
    color: ${colors.tertiary};
`;
const ContentDate = styled.span`
    font-size: 12px;
`;

function Content({ firstname, lastname, avatar, date, text, img, comments, like, usersLike, contentId }) {
    let servDate = date.split('T').join(' ').split('.000Z').join('');
    let time = servDate.split(/[- :]/);
    var formatedTime = new Date(Date.UTC(time[0], time[1] - 1, time[2], time[3], time[4], time[5]));
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };
    let formatedDate = formatedTime.toLocaleDateString(process.env.REACT_APP_LOCAL_DATE, options);
    return (
        <ContentContainer className='container m-2 p-2 col-3'>
            <div className='d-flex border-bottom border-danger'>
                <AvatarImgContainer className='me-2'>
                    <Avatar src={avatar} className='img-fluid rounded-circle' alt='' />
                </AvatarImgContainer>
                <div>
                    <UserName className='d-block fw-bold'>
                        {firstname} {lastname}
                    </UserName>
                    <ContentDate className='d-block'>{formatedDate}</ContentDate>
                </div>
            </div>
            <div>{text}</div>
            <div>
                <img src={img} className='img-fluid' alt='' />
            </div>
            <ContentInteraction
                key={contentId}
                likes={like}
                comments={comments}
                contentId={contentId}
                usersLike={usersLike}
            />
        </ContentContainer>
    );
}

export default Content;
