import Header from '../components/Header';
import styled from 'styled-components';

const ErrorMsg = styled.div`
    box-shadow: 1px 12px 41px 0px rgba(0, 0, 0, 0.38);
    text-align: center;
`;

function Error() {
    return (
        <>
            <Header />
            <div className='container'>
                <ErrorMsg className='bg-light d-flex justify-content-center m-5 p-4 fw-bold fs-3 rounded-pill'>
                    <span>La page que vous cherchez n’existe pas.</span>
                </ErrorMsg>
            </div>
        </>
    );
}

export default Error;
