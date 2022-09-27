import { useState, createContext } from 'react';

export const IsLoginPage = createContext({
    trueOrFalse: true,
    setLoginPage: () => {},
});

export const IsLoginProvider = ({ children }) => {
    const [trueOrFalse, setLoginPage] = useState(true);
    const loginPageHandler = (trueOrFalse) => {
        setLoginPage(trueOrFalse);
    };
    const contextLoginValue = {
        trueOrFalse: trueOrFalse,
        login: loginPageHandler,
    };

    return <IsLoginPage.Provider value={contextLoginValue}>{children}</IsLoginPage.Provider>;
};
