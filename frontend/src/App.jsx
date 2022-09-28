import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Header from './components/Header.jsx';
import { BrowserRouter, Route, Routes /* Link, useParams  */ } from 'react-router-dom';
import Home from './pages/home.jsx';
import Profil from './pages/Profil.jsx';
/* import { useContext } from 'react';
import { IsLoginPage } from './utilis/contextLogin.jsx'; */

function App() {
    /*     let token = sessionStorage.getItem('auth');
    const isLoginOrSignup = useContext(IsLoginPage); */

    return (
        <div>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/profil' element={<Profil />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/login' element={<Login />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
