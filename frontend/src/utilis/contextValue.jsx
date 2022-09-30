import { useState, createContext } from 'react';
/* const authorizatrion = "" */
export const UserAuth = createContext({
    token: '',
    userId: '',
    permission: '',
    img: '',
    setAuth: () => {},
    setId: () => {},
    setPermission: () => {},
    setImg: () => {},
});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const loginHandler = (auth) => {
        setAuth(auth);
    };
    const [id, setId] = useState(null);
    const idHandler = (id) => {
        setId(id);
    };
    const [permission, setPermission] = useState(null);
    const permHandler = (permission) => {
        setPermission(permission);
    };

    const [imgUrl, setImgUrl] = useState(null);
    const imgHandler = (imgUrl) => {
        setImgUrl(imgUrl);
    };
    const contextValue = {
        token: auth,
        login: loginHandler,
        id: id,
        img: imgUrl,
        saveImg: imgHandler,
        saveId: idHandler,
        permission: permission,
        savePermission: permHandler,
    };

    return <UserAuth.Provider value={contextValue}>{children}</UserAuth.Provider>;
};
