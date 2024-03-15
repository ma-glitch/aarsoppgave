import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/login.css';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import {auth, provider} from './firebase';




const LoginForm: React.FC = () => {
  const [userType, setUserType] = useState('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [useCookie, setCookie] = useCookies(['Loggedin', 'Kundeid', 'Fornavn', 'Etternavn', 'Epost', 'Ansatt']);
  const navigate = useNavigate();

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleUserTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setUserType(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

   if (userType === 'Kunde') {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, username, password);
        const response = await axios.post('http://10.200.1.117:8000/login.php', {
          username,
          password,
        });
        const { kundeid, fornavn, etternavn, epost} = response.data;
        const ansatt = ' ';
        setResponseMessage(response.data.message);
        setCookie('Loggedin', 'yes', { path: '/', maxAge: 30 * 24 * 60 * 60 });
        setCookie('Kundeid', kundeid, { path: '/', maxAge: 30 * 24 * 60 * 60 });
        setCookie('Fornavn', fornavn, { path: '/', maxAge: 30 * 24 * 60 * 60 });
        setCookie('Etternavn', etternavn, { path: '/', maxAge: 30 * 24 * 60 * 60 });
        setCookie('Epost', epost, { path: '/', maxAge: 30 * 24 * 60 * 60 });
        setCookie('Ansatt', ansatt, { path: '/', maxAge: 30 * 24 * 60 * 60 });
        console.log(response);
        if (response.data.success === true){
          
         toast.success('Logget in!'); 
        } else {
          toast.error('Noe gikk galt');
        }
        const user = userCredential.user;
        navigate('/');
      } catch (error) {
        toast.error('Feil Epost eller Passord!')
      }
    } else if (userType === 'Ansatt') {
      try {
        const response = await axios.post('http://10.200.1.117:8000/login_ansatt.php', {
          username,
          password,
        });
        console.log(response);
        const { kundeid, fornavn, etternavn, epost} = response.data;
        const ansatt = 'yes';
        setResponseMessage(response.data.message);
        setCookie('Loggedin', 'yes', { path: '/', maxAge: 30 * 24 * 60 * 60 });
        setCookie('Kundeid', kundeid, { path: '/', maxAge: 30 * 24 * 60 * 60 });
        setCookie('Fornavn', fornavn, { path: '/', maxAge: 30 * 24 * 60 * 60 });
        setCookie('Etternavn', etternavn, { path: '/', maxAge: 30 * 24 * 60 * 60 });
        setCookie('Epost', epost, { path: '/', maxAge: 30 * 24 * 60 * 60 });
        setCookie('Ansatt', ansatt, { path: '/', maxAge: 30 * 24 * 60 * 60 });
        navigate('/');
      } catch (error) {
        setError('Invalid username or password');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      
      const email = user.email;
      let fornavn = '';
      let etternavn = '';
    
     
      if (user.displayName) {
        const displayNameParts = user.displayName.split(' ');
        fornavn = displayNameParts[0];
        etternavn = displayNameParts.slice(1).join(' ');
      }
  
      
      const response = await axios.post('http://10.200.1.117:8000/login.php', {
        username: email, 
        password: 'google', 
      });
  
      
      setResponseMessage(response.data.message);
      if (response.data.success === true) {
        
        const { kundeid, fornavn, etternavn, epost } = response.data;
        const ansatt = '';
        setCookie('Loggedin', 'yes', { path: '/', maxAge: 30 * 24 * 60 * 60 });
        setCookie('Kundeid', kundeid, { path: '/', maxAge: 30 * 24 * 60 * 60 });
        setCookie('Fornavn', fornavn, { path: '/', maxAge: 30 * 24 * 60 * 60 });
        setCookie('Etternavn', etternavn, { path: '/', maxAge: 30 * 24 * 60 * 60 });
        setCookie('Epost', epost, { path: '/', maxAge: 30 * 24 * 60 * 60 });
        setCookie('Ansatt', ansatt, { path: '/', maxAge: 30 * 24 * 60 * 60 });
  
        toast.success('Logget in!');
        navigate('/');
      } else {
      
        toast.error('Noe gikk galt');
      }
    } catch (error) {
      console.error(error);
      toast.error('Noe gikk galt');
    }
  };
  
  

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className='loginform'>
        <input
          type="text"
          placeholder="Epost"
          name='username'
          value={username}
          onChange={handleUsernameChange}
        />
        <input
          type="password"
          placeholder="Passord"
          name='password'
          value={password}
          onChange={handlePasswordChange}
        />
        <select value={userType} onChange={handleUserTypeChange}>
          <option value="Velg">Velg innlogings metode</option>
          <option value="Kunde">Kunde</option>
          <option value="Ansatt">Ansatt</option>
        </select>
        <button type="submit">Login</button>  
      </form>
      <button className="google-signin-button" onClick={handleGoogleSignIn}>Log på med google</button>
      <p className='Ny'>Ny her?<Link to="/RegistrationForm" className='link'>Registrer deg nå</Link></p>
      {error && <div className='error'>{error}</div>}
      {responseMessage && <div className='response'>{responseMessage}</div>}
        
     </div>
  );
};

export default LoginForm;
