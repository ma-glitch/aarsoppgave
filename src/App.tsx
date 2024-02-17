import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Hjem from './pages/Hjem';
import Produkter from './pages/produkter';
import Nav from './components/Nav';
import LoginForm from './login';
import { useCookies } from 'react-cookie';
import MinSide from './pages/Minside';
import RegistrationForm from './registrering';
import Handlekurv from './pages/handlekurv';

const App: React.FC = () => {
  const [cookies] = useCookies(['Fornavn']);
  const username: string | undefined = cookies['Fornavn']; 

  return (
    <Router>
       <Nav />
      <Routes>
        <Route path="/" element={<Hjem/>} />
        <Route path="/produkter" element={<Produkter/>} />
        <Route path="/Loginform" element ={<LoginForm/>} />
        <Route path='/Handlekurv' element={<Handlekurv/>} />
        <Route path='/MinSide' element={<MinSide/>} />
        <Route path='/RegistrationForm' element={<RegistrationForm/>} />
      </Routes>
      
    </Router>
  );
}

export default App;