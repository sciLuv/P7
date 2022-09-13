import styled from 'styled-components';
import Logo from '../assets/logo.svg';

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

function Header() {
    return (
        <StyledHeader>
            <StyledLogo>
                <img src={Logo} alt='logo de groupomania' />
            </StyledLogo>
        </StyledHeader>
    );
}
export default Header;
