//function to remove information in sessionStorage when user want to deconnect
async function userInfoSuppr() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('lastProfilPageId');
    document.location.href = 'http://localhost:3000/login';
}

export default userInfoSuppr;
