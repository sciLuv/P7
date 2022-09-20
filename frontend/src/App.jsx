import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import HeaderBeforeConnect from './components/header/HeaderBeforeConnect.jsx';
import HeaderConnected from './components/header/HeaderConnected.jsx';
import { BrowserRouter, Route, Routes /* Link, useParams  */ } from 'react-router-dom';
import Home from './pages/home.jsx';

function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<HeaderConnected />} />
                    <Route path='/profil' element={<HeaderConnected />} />
                    <Route path='/signup' element={<HeaderBeforeConnect />} />
                    <Route path='/login' element={<HeaderBeforeConnect />} />
                </Routes>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/login' element={<Login />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
