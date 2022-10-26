import { createGlobalStyle } from 'styled-components';

const StyledGlobalStyle = createGlobalStyle`

    body{
        /*request font*/
        font-family: 'Lato', sans-serif !important;
        background-color: #eaeaea;
        
    }
    #test{
        overflow: hidden;
    }

    /* remove base style of link HTML element */
    a{
    text-decoration: none;
    color: #4e5166;
    }

    /* to adding pointer to element in link with link or CRUD action */
    .hover-item{
    cursor: pointer;
    }

    /* to manage apparition of button to modifying comment*/
    .fa-ellipsis{
    opacity: 0;
    cursor: pointer;
    }
    .comment:hover .fa-ellipsis{
    opacity: 1;
    }

    /* to setup textarea */
    textarea{
    white-space: pre-wrap;
    }

    /* login and signup page, font-awesome icon of password input */
    .fa-eye, .fa-eye-slash{
    position: relative;
    top: -25px;
    cursor: pointer;
    }

    /* avatar style in content, comment, and home page */
    .avatarImgContainer{
        height: 45px;
        min-height: 45px;
        width: 45px;
        min-width: 45px;
    };
    .avatar{
        width: 100%;
        height: 100%;
        object-fit: cover;
    };

    /* btn neutral style */
    .btn-neutral{
        border: none;
        background-color: rgba(234, 234, 234, 0);
    }

`;

export default StyledGlobalStyle;
