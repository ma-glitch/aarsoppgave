import React, { useState } from 'react';
import axios from 'axios';
import './login.css';
import path from 'path';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [, setCookie] = useCookies(['Kundeid', 'Fornavn', 'Etternavn', 'Epost']);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/server/login.php', {
        username,
        password,
      });
      console.log(response);
      const { kundeid, fornavn, etternavn, epost } = response.data;
      setResponseMessage(response.data.message);
      setCookie('Kundeid', kundeid, { path: '/', maxAge: 30 * 24 * 60 * 60 });
      setCookie('Fornavn', fornavn, { path: '/', maxAge: 30 * 24 * 60 * 60 });
      setCookie('Etternavn', etternavn, { path: '/', maxAge: 30 * 24 * 60 * 60 });
      setCookie('Epost', epost, { path: '/', maxAge: 30 * 24 * 60 * 60 });
      navigate('/');
    } catch (error) {
      setError('Invalid username or password');
    }
  };


  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <div className='container'>
      <form onSubmit={handleSubmit} className='loginform'>
        <input
          type="text"
          placeholder="Brukernavn"
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
        <button type="submit">Login</button>
      </form>
      <p className='Ny'>Ny her?<Link to="/RegistrationForm" className='link'>Registrer deg nå</Link></p>
      {error && <div className='error'>{error}</div>}
      {responseMessage && <div className='response'>{responseMessage}</div>}
    </div>
  );
};

export default LoginForm;

