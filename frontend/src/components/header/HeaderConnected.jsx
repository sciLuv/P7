import styled from 'styled-components';
import Logo from '../../assets/logo.svg';
import { Link } from 'react-router-dom';

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
    return (
        <StyledHeader className='d-flex justify-content-between'>
            <StyledLogo>
                <img src={Logo} alt='logo de groupomania' />
            </StyledLogo>
            <nav className='navbar'>
                <ul className='navbar-nav d-flex flex-row'>
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
                </ul>
            </nav>
        </StyledHeader>
    );
}
export default HeaderConnected;
