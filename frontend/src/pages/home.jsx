import { useEffect, useState, useContext } from 'react';
import Content from '../components/Content.jsx';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../utilis/contextValue.jsx';

const AvatarImgContainer = styled.div`
    height: 40px;
    width: 45px;
`;
const Avatar = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

function Home() {
    const [contentList, setContentList] = useState([]);
    const navigate = useNavigate();
    const authCtx = useContext(UserAuth);
    console.log(authCtx);

    useEffect(() => {
        const reqOptions = {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + authCtx.token,
            },
        };
        fetch('http://localhost:3005/', reqOptions)
            .then((res) => {
                if (!res.ok) {
                    navigate('/login');
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

    //les constantes liées au form d'ajout de contenu
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);

    let handleSubmit = async (e) => {
        let test = { text: text };
        let formData = new FormData();
        formData.append('content', JSON.stringify(test));
        formData.append('image', file);

        e.preventDefault();
        const reqOptions = {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + authCtx.token,
            },
            body: formData,
        };
        fetch('http://localhost:' + process.env.REACT_APP_BACKEND_PORT + '/', reqOptions)
            .then((res) => {
                console.log(res);
                return res.json();
            })
            .then((data) => {
                console.log(data);
                setContentList(data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className='container'>
            {/* ici c'est le form d'ajout de contenu */}
            <div className='container m-2 p-2  col-12 d-flex'>
                <AvatarImgContainer className='me-2'>
                    <Avatar
                        src='http://localhost:3005/images/defaultAvatar.png'
                        className='img-fluid rounded-circle'
                        alt=''
                    />
                </AvatarImgContainer>
                <form onSubmit={handleSubmit} className='col-11'>
                    <textarea
                        className='form-control'
                        id='exampleFormControlTextarea1'
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows='1'
                        placeholder='Quelque chose a partager a vos collegues ?'
                    ></textarea>
                    <div className='d-flex justify-content-between mt-2'>
                        <input
                            type='file'
                            onChange={(e) => setFile(e.target.files[0])} /* value={file} */
                        ></input>
                        <button type='submit' className='btn btn-primary'>
                            Publier
                        </button>
                    </div>
                </form>
            </div>

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
                        userId={content.userId}
                        contentList={contentList}
                        setContentList={setContentList}
                    />
                ))}
            </section>
        </div>
    );
}

export default Home;
