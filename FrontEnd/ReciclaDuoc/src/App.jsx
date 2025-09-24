import './App.css'
import { Routes, Route } from 'react-router';
import RegisterScreen from './Components/Registro/Register';
import MainMenu from './Components/Registro/MainMenu';


function App() {
    return (
        <Routes>
            <Route path="/" element={<MainMenu />} />
            <Route path="/register" element={<RegisterScreen />} />
        </Routes>
    );
}

export default App;
