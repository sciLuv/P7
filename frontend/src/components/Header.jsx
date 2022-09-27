import styled from 'styled-components';
import Logo from '../assets/logo.svg';
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
/* import { IsLoginPage } from '../utilis/contextLogin'; */
import Login from '../pages/Login';

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

function HeaderConnected() {
    /* const isLoginOrSignup = useContext(IsLoginPage); */
    let token = sessionStorage.getItem('auth');
    console.log(token);

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
                            <li className='nav-item m-2'>
                                <Link className='nav-link' to='/profil'>
                                    profil
                                </Link>
                            </li>
                            <li className='nav-item m-2'>
                                <Link className='nav-link' to='/'>
                                    parametre
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
