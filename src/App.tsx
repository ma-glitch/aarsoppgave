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
import Betaling from './pages/betaling';
import Ansatt from './pages/Ansatt';
import Takk from './pages/takk';
import {Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  const [cookies] = useCookies(['Fornavn']);
  const username: string | undefined = cookies['Fornavn']; 

  return (
    <Router>
      <ToastContainer position='top-center'
      limit={10}
      autoClose={5000}
      newestOnTop
      theme='colored'
      closeOnClick
      pauseOnHover
      transition={Bounce} />
       <Nav />
      <Routes>
        <Route path="/" element={<Hjem/>} />
        <Route path="/produkter" element={<Produkter/>} />
        <Route path="/Loginform" element ={<LoginForm/>} />
        <Route path='/Handlekurv' element={<Handlekurv/>} />
        <Route path='/MinSide' element={<MinSide/>} />
        <Route path='/RegistrationForm' element={<RegistrationForm/>} />
        <Route path='/betaling' element={<Betaling/>} />
        <Route path='/Ansatt' element={<Ansatt/>} />
        <Route path='/Takk' element={<Takk />} />
      </Routes>
      
    </Router>
  );
}

export default App;