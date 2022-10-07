import styled from 'styled-components';
import logo from '../assets/logo.svg';
import logoName from '../assets/logoName.svg';
import { Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { UserAuth } from '../utilis/contextValue.jsx';
import userInfoSuppr from '../utilis/userInfoSuppr';

const StyledHeader = styled.header`
    position: sticky;
    z-index: 10;
    top: 0px;
    height: 60px;
    width: 100%;
    padding: 5px 0px;
    background-color: white;
    box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.274);
`;
const StyledLogo = styled.div`
    display: flex;
    height: 100%;
    width: 250px;
    margin-left: 8px;
    object-fit: cover;
    @media (max-width: 576px) {
        width: 43px;
    }
`;
const LogoNameContain = styled.img`
    @media (max-width: 576px) {
        height: 0px;
        width: 0px;
    }
`;
const AvatarImgContainer = styled.div`
    height: 60px;
    width: 60px;
    margin-top: -5px;
    position: relative;
    top: -17px;
`;
const Avatar = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const DeconnectDropDown = styled.ul`
    left: ${(props) => (props.profil ? '-70px !important' : '-135px !important')};
    cursor: pointer;
    user-select: none;
`;

function Header() {
    const authCtx = useContext(UserAuth);
    const location = useLocation();
    const idProfil = location.state;

    return (
        <StyledHeader className='d-flex justify-content-between'>
            <Link to='/'>
                <StyledLogo>
                    <img src={logo} alt='logo de groupomania' />
                    <LogoNameContain src={logoName} alt='logo de groupomania' />
                </StyledLogo>
            </Link>
            <nav className='navbar'>
                <ul className='navbar-nav d-flex flex-row'>
                    {authCtx.token === null ? (
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
                            {idProfil === authCtx.id ? null : (
                                <li className='nav-item '>
                                    <Link className='nav-link' to='/profil' state={authCtx.id}>
                                        <AvatarImgContainer className='me-2'>
                                            <Avatar
                                                src={authCtx.img}
                                                className='img-fluid rounded-circle'
                                                alt=''
                                            />
                                        </AvatarImgContainer>
                                    </Link>
                                </li>
                            )}

                            <li className='nav-item mb-5 me-2'>
                                <div className='d-flex flex-column'>
                                    <div
                                        className='mt-2'
                                        type='button'
                                        data-bs-toggle='dropdown'
                                        aria-expanded='false'
                                    >
                                        <i className='fa-solid fa-arrow-right-from-bracket'></i>
                                    </div>
                                    <DeconnectDropDown
                                        className='dropdown-menu position-absolute'
                                        profil={!(idProfil - authCtx.id === 0)}
                                    >
                                        <li>
                                            <div
                                                className='dropdown-item'
                                                onClick={() => {
                                                    userInfoSuppr();
                                                }}
                                            >
                                                déconnexion
                                            </div>
                                        </li>
                                    </DeconnectDropDown>
                                </div>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </StyledHeader>
    );
}
export default Header;
