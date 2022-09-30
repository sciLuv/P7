import styled from 'styled-components';
import Logo from '../assets/logo.svg';
import { Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { UserAuth } from '../utilis/contextValue.jsx';

const StyledHeader = styled.header`
    height: 50px;
    width: 100%;
    border-bottom: solid #fd2d01 2px;
`;
const StyledLogo = styled.div`
    height: 100%;
    width: 250px;
    margin-left: 5px;
    object-fit: cover;
`;
const AvatarImgContainer = styled.div`
    height: 49px;
    width: 48px;
    position: relative;
    top: -17px;
`;
const Avatar = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

function HeaderConnected() {
    /* const isLoginOrSignup = useContext(IsLoginPage); */
    const authCtx = useContext(UserAuth);
    let token = authCtx.token;
    console.log(window.location.href);
    const location = useLocation();
    const idProfil = location.state;

    return (
        <StyledHeader className='d-flex justify-content-between'>
            <Link to='/'>
                <StyledLogo>
                    <img src={Logo} alt='logo de groupomania' />
                </StyledLogo>
            </Link>
            <nav className='navbar'>
                <ul className='navbar-nav d-flex flex-row'>
                    {token === null ? (
                        <>
                            <li className='nav-item m-2'>
                                <Link className='nav-link' to='/signup'>
                                    Inscription
                                </Link>
                            </li>
                            <li className='nav-item m-2'>
                                <Link className='nav-link' to='/login'>
                                    Connexion
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            {console.log('auth' + authCtx.id)}
                            {console.log('id' + idProfil)}
                            {idProfil === authCtx.id ? null : (
                                <li className='nav-item '>
                                    <Link className='nav-link' to='/profil' state={authCtx.id}>
                                        <AvatarImgContainer className='me-2'>
                                            <Avatar src={authCtx.img} className='img-fluid' alt='' />
                                        </AvatarImgContainer>
                                    </Link>
                                </li>
                            )}

                            <li className='nav-item m-2'>
                                <Link className='nav-link' to='/'>
                                    <i class='fa-solid fa-gear'></i>
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </StyledHeader>
    );
}
export default HeaderConnected;
