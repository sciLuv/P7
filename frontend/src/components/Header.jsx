//style relative Import
import styled from 'styled-components';
import logo from '../assets/logo.svg';
import logoName from '../assets/logoName.svg';
//React and ReactRouter elements's import
import { useContext } from 'react'; //react method to use data in state and context
import { UserAuth } from '../utilis/contextValue.jsx'; //function to put user information to the context of the app
import { Link, useLocation } from 'react-router-dom'; //react-dom method to go to another page
//function
import userInfoSuppr from '../utilis/userInfoSuppr'; //delete data in session storage

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
    //actual users informations set in react memory, available everywhere in the app.
    const authCtx = useContext(UserAuth);
    //constants to show or not the link to the profil user, in the navbar
    const location = useLocation();
    const idProfil = location.state;

    //here, use the bootstrap class to adding style to the component.
    return (
        <StyledHeader className='d-flex justify-content-between'>
            <h1>
                <Link to='/' aria-label="page d'acceuil">
                    <StyledLogo>
                        <img src={logo} alt='logo de groupomania' />
                        <LogoNameContain src={logoName} alt='reste du logo de groupomania' />
                    </StyledLogo>
                </Link>
            </h1>
            <nav className='navbar'>
                <ul className='navbar-nav d-flex flex-row'>
                    {
                        //show inscription and connection button if useContext doesn't exist
                        authCtx.token === null ? (
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
                                {
                                    //to show or not the link to the profil user, in the navbar
                                    idProfil === authCtx.id ? null : (
                                        <li className='nav-item '>
                                            <Link
                                                aria-label='profil'
                                                className='nav-link'
                                                to='/profil'
                                                state={authCtx.id}
                                            >
                                                <AvatarImgContainer className='me-2'>
                                                    <Avatar
                                                        src={authCtx.img}
                                                        className='img-fluid rounded-circle'
                                                        alt='avatar'
                                                    />
                                                </AvatarImgContainer>
                                            </Link>
                                        </li>
                                    )
                                }

                                <li className='nav-item mb-5 me-2 '>
                                    <div className='d-flex flex-column'>
                                        <button
                                            aria-label='déconnexion'
                                            className='mt-2 btn-neutral'
                                            type='button'
                                            data-bs-toggle='dropdown'
                                            aria-expanded='true'
                                        >
                                            <i className='fa-solid fa-arrow-right-from-bracket'></i>
                                        </button>
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
                                                    onFocus={() => {
                                                        userInfoSuppr();
                                                    }}
                                                    tabIndex='0'
                                                >
                                                    déconnexion
                                                </div>
                                            </li>
                                        </DeconnectDropDown>
                                    </div>
                                </li>
                            </>
                        )
                    }
                </ul>
            </nav>
        </StyledHeader>
    );
}
export default Header;
