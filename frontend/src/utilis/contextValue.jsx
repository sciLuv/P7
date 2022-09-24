import { useState, createContext } from 'react';

/* const authorizatrion = "" */
export const UserAuth = createContext({
    token: '',
    setAuth: () => {},
});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const loginHandler = (auth) => {
        setAuth(auth);
    };
    const contextValue = {
        token: auth,
        login: loginHandler,
    };

    return <UserAuth.Provider value={contextValue}>{children}</UserAuth.Provider>;
};
