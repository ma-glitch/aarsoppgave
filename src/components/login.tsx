import React, { useState } from 'react';
import axios from 'axios';
import '../styles/login.css';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

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
        navigate('/');
      } catch (error) {
        setError('Invalid username or password');
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
      <p className='Ny'>Ny her?<Link to="/RegistrationForm" className='link'>Registrer deg nå</Link></p>
      {error && <div className='error'>{error}</div>}
      {responseMessage && <div className='response'>{responseMessage}</div>}
    </div>
  );
};

export default LoginForm;
