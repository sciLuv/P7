import styled from 'styled-components';
import { useState } from 'react';

const AvatarImgContainer = styled.div`
    height: 40px;
    width: 45px;
`;
const Avatar = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;
function PostContent({ contentList, setContentList }) {
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);

    let handleSubmit = async (e) => {
        /*         let test = { text: text };
        const formData = new formData();
        formData.append('content', test);
        formData.append('image', file);
        console.log(formData); */
        let test = { text: text };
        let formData = new FormData();
        formData.append('content', JSON.stringify(test));
        formData.append('image', file);

        for (const value of formData.values()) {
            console.log(value);
        }
        e.preventDefault();
        const reqOptions = {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('auth'),
            },
            body: formData,
        };
        fetch('http://localhost:' + process.env.REACT_APP_BACKEND_PORT + '/', reqOptions)
            .then((res) => {
                console.log(res);
                res.json();
            })
            .then((data) => {
                console.log(data);
                setContentList(contentList + 'hello');
                console.log(contentList);
                /* window.location.replace('http://localhost:' + process.env.REACT_APP_FRONTEND_PORT + '/'); */
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
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
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PostContent;
