import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home.jsx';
import Profil from './pages/Profil.jsx';
import StyledGlobalStyle from './utilis/globalStyle.jsx';

function App() {
    return (
        <div>
            <StyledGlobalStyle />
            <BrowserRouter>
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
