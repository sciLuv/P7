async function userInfoSuppr() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('lastProfilPageId');
    document.location.href = 'http://localhost:3000/login';
}

export default userInfoSuppr;
