import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Hjem from './pages/Hjem';
import Produkter from './pages/produkter';
import Nav from './components/Nav';
import LoginForm from './components/login';
import RegistrationForm from './components/registrering';
import Handlekurv from './pages/handlekurv';
import Betaling from './pages/betaling';
import Ansatt from './pages/Admin/admin';
import Takk from './pages/takk';
import Support from './pages/faq';
import Bestillinger from './pages/MinSide/bestillinger';
import Innstillinger from './pages/MinSide/innstillinger';
import {Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  
  return (
    <div>
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
        <Route path='/RegistrationForm' element={<RegistrationForm/>} />
        <Route path='/betaling' element={<Betaling/>} />
        <Route path='/Ansatt' element={<Ansatt/>} />
        <Route path='/Takk' element={<Takk />} />
        <Route path='/Support' element={<Support />} />
        <Route path='/Innstillinger' element={<Innstillinger/>} />
        <Route path='/Bestillinger' element={<Bestillinger/>} />
      </Routes>
      
    </Router>
</div>
  );
}

export default App;