import styled from 'styled-components';
import Logo from '../assets/logo.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserAuth } from '../utilis/contextValue.jsx';
import userInfoSuppr from '../utilis/userInfoSuppr';

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

const DeconnectDropDown = styled.ul`
    left: -80px !important;
    cursor: pointer;
`;

function Header() {
    const authCtx = useContext(UserAuth);
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
                                            <Avatar src={authCtx.img} className='img-fluid' alt='' />
                                        </AvatarImgContainer>
                                    </Link>
                                </li>
                            )}

                            <li className='nav-item mb-5 me-2'>
                                <div className='d-flex flex-column'>
                                    <div
                                        className='mt-2 me-2'
                                        type='button'
                                        data-bs-toggle='dropdown'
                                        aria-expanded='false'
                                    >
                                        <i className='fa-solid fa-arrow-right-from-bracket'></i>
                                    </div>
                                    <DeconnectDropDown className='dropdown-menu position-absolute'>
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
