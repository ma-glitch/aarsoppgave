import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../styles/registrering.css";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCookies } from 'react-cookie';
import { createUserWithEmailAndPassword, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import {auth, provider} from './firebase';


const RegistrationForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fornavn, setFornavn] = useState('');
  const [etternavn, setEtternavn] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const nav = useNavigate();
  const [useCookie, setCookie] = useCookies(['Loggedin', 'Kundeid', 'Fornavn', 'Etternavn', 'Epost', 'Ansatt']);


const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = auth.currentUser;
    if (user) {
      await sendEmailVerification(user);
      toast.info('Sjekk eposten din for å bekrefte kontoen!');
      const response = await axios.post('http://10.200.1.117:8000/registrer.php', {
        fornavn,
        etternavn,
        email,
        password,
      });
      setSuccessMessage(response.data.message);
      if (response.data.message === 'Username or email already exists') {
        toast.error('Denne eposten er allerede i bruk');
      } else if (response.data.success === true) {
        toast.success('Registrering fullført.');
        navigate('/LoginForm');
      } else {
        toast.error('Noe gikk galt.');
      }
    } else {
      toast.error('Noe gikk galt. Prøv igjen senere.');
    }
  } catch (error) {
    toast.error('Noe gikk galt');
  }
};



  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleFornavnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFornavn(event.target.value);
  };

  const handleEtternavnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEtternavn(event.target.value);
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
  

      if (!user?.emailVerified) {
        try {
          await sendEmailVerification(user);
          toast.info('Sjekk e-posten din for å bekrefte kontoen.');
          console.log('email sendt');
        } catch (error) {
          console.error('Error sending verification email:', error);
        }
      }

      const response = await axios.post('http://10.200.1.117:8000/registrer.php', {
        fornavn,
        etternavn,
        email,
        password: 'google',
      });
  
      setSuccessMessage(response.data.message);
  
      
      if (response.data.message === 'Username or email already exists') {
        toast.error('Denne eposten er allerede i bruk');
      } else {
        
        try {
          const response = await axios.post('http://10.200.1.117:8000/login_google.php', {
            username: email,
            password: 'google',
          });
  
          const { kundeid, fornavn, etternavn, epost } = response.data;
          const ansatt = ' ';
  
          
          setCookie('Loggedin', 'yes', { path: '/', maxAge: 30 * 24 * 60 * 60 });
          setCookie('Kundeid', kundeid, { path: '/', maxAge: 30 * 24 * 60 * 60 });
          setCookie('Fornavn', fornavn, { path: '/', maxAge: 30 * 24 * 60 * 60 });
          setCookie('Etternavn', etternavn, { path: '/', maxAge: 30 * 24 * 60 * 60 });
          setCookie('Epost', epost, { path: '/', maxAge: 30 * 24 * 60 * 60 });
          setCookie('Ansatt', ansatt, { path: '/', maxAge: 30 * 24 * 60 * 60 });
  
          if (response.data.success === true) {
            toast.success('Logget in!');
          } else {
            toast.error('Noe gikk galt');
          }
  
          nav('/');
        } catch (error) {
          toast.error('Feil Epost eller Passord!');
        }
      }
    } catch (error) {
      console.log(error);
      toast.error('Noe gikk galt');
    }
  };
  

  return (
    <div className='registration-container'>
      <form onSubmit={handleSubmit} className='registration-form'>
      <input
          type="text"
          placeholder="Fornavn"
          value={fornavn}
          onChange={handleFornavnChange}
        />
         <input
          type="text"
          placeholder="Etternavn"
          value={etternavn}
          onChange={handleEtternavnChange}
        />
        <input
          type="email"
          placeholder="Epost"
          value={email}
          onChange={handleEmailChange}
        />
        <input
          type="password"
          placeholder="Passord"
          value={password}
          onChange={handlePasswordChange}
        />
        <button type="submit">Register</button>
      </form>
      <button onClick={handleGoogleSignIn} className="google-signin-button">Registrer deg med Google</button>
      <p className='har'>Har du allerede bruker?<Link to="/LoginForm" className='link'>Log in her</Link></p>
      {error && <div className='error'>{error}</div>}
      {successMessage && <div className='success'>{successMessage}</div>}
    </div>
  );
};

export default RegistrationForm;
