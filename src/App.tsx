import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Hjem from './pages/Hjem';
import Produkter from './pages/produkter';
import Nav from './components/Nav';

const App: React.FC = () => {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Hjem/>} />
        <Route path="/produkter" element={<Produkter/>} />
      </Routes>
      
    </Router>
  );
}

export default App;