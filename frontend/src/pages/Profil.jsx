import { useState, useEffect, useContext } from 'react';
import { UserAuth } from '../utilis/contextValue';
import { useNavigate } from 'react-router-dom';
import Content from '../components/Content.jsx';

function Profil() {
    const navigate = useNavigate();
    const authCtx = useContext(UserAuth);
    const [userContentList, setUserContentList] = useState([]);
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
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <div>
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
    );
}

export default Profil;
