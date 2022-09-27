import { useState, createContext } from 'react';
/* const authorizatrion = "" */
export const UserAuth = createContext({
    token: '',
    userId: '',
    permission: '',
    setAuth: () => {},
    setId: () => {},
    setPermission: () => {},
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
    const contextValue = {
        token: auth,
        login: loginHandler,
        id: id,
        saveId: idHandler,
        permission: permission,
        savePermission: permHandler,
    };

    return <UserAuth.Provider value={contextValue}>{children}</UserAuth.Provider>;
};
