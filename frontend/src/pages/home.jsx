import { useEffect, useState } from 'react';
import Content from '../components/Content.jsx';
import PostContent from '../components/PostContent.jsx';

function Home() {
    const [contentList, setContentList] = useState([]);

    useEffect(() => {
        const reqOptions = {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('auth'),
            },
        };
        fetch('http://localhost:3005/', reqOptions)
            .then((res) => {
                if (!res.ok) {
                    window.location.replace(
                        'http://localhost:' + process.env.REACT_APP_FRONTEND_PORT + '/login'
                    );
                } else {
                    return res.json();
                }
            })
            .then((data) => {
                setContentList(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <div className='container'>
            <PostContent contentList={contentList} setContentList={setContentList} />
            <section>
                {contentList.map((content) => (
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
                    />
                ))}
            </section>
        </div>
    );
}

export default Home;
