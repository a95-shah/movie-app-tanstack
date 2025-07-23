// App.jsx
import Home from './pages/Home';
import { Routes, Route } from 'react-router-dom';
import Favorites from './pages/Favorites';
import MovieDetails from './pages/MovieDetails';
import NavBar from './components/NavBar';
import './App.css';

function App() {
  return (
    <>
      <NavBar />
      <main className='main-content'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
