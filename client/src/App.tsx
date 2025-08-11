import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import PokemonDetailPage from './pages/PokemonDetailPage';
import './styles/App.css';

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pokemon/:pokemonId" element={<PokemonDetailPage />} />
        </Routes>
    )
}

export default App;