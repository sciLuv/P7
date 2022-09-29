import colors from '../utilis/colors';
import '../style/style.css';
import styled from 'styled-components';
import { useState, useEffect, useContext } from 'react';
import { UserAuth } from '../utilis/contextValue';
import { useNavigate } from 'react-router-dom';
import Content from '../components/Content.jsx';

const UserInfoContainer = styled.div`
    background-color: ${colors.tertiary};
`;

function Profil() {
    const navigate = useNavigate();
    const authCtx = useContext(UserAuth);
    const [userContentList, setUserContentList] = useState([]);
    const [userInfo, setUserInfo] = useState([]);
    useEffect(() => {
        const reqOptions = {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + authCtx.token,
            },
        };
        fetch('http://localhost:3005/profil/' + authCtx.id, reqOptions)
            .then((res) => {
                if (!res.ok) {
                    navigate('/login');
                } else {
                    return res.json();
                }
            })
            .then((data) => {
                setUserContentList(data);
                fetch('http://localhost:3005/user/' + authCtx.id, reqOptions)
                    .then((res) => {
                        if (!res.ok) {
                            navigate('/login');
                        } else {
                            return res.json();
                        }
                    })
                    .then((data) => {
                        setUserInfo(data);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    console.log('--------------------');
    console.log(userContentList);
    console.log('--------------------');

    return (
        <div className='profil-page-container'>
            <UserInfoContainer className=' d-flex align-items-center justify-content-between'>
                <div className='p-4'>
                    <img
                        src={userInfo.imgUrl}
                        className='img-fluid rounded-circle avatar-profil-page'
                        alt=''
                    />
                </div>
                <div className='mt-3 me-5 text-danger fs-3'>
                    <span>{userInfo.lastname} </span>
                    <span>{userInfo.firstname}</span>
                </div>
            </UserInfoContainer>
            <div className='container'>
                {userContentList.map((content) => (
                    <Content
                        key={content.id}
                        contentId={content.id}
                        firstname={content.user.firstname}
                        lastname={content.user.lastname}
                        avatar={content.user.imgUrl}
                        text={content.text}
                        img={content.imgUrl}
                        comments={content.comments}
                        like={content.like}
                        usersLike={content.usersLike}
                        date={content.createdAt}
                        userId={content.userId}
                        contentList={userContentList}
                        setContentList={setUserContentList}
                    />
                ))}
            </div>
        </div>
    );
}

export default Profil;
