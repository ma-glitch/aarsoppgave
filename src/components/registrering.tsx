import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../styles/registrering.css";
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';


const RegistrationForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fornavn, setFornavn] = useState('');
  const [etternavn, setEtternavn] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://10.200.1.117:8000/registrer.php', {
      fornavn,  
      etternavn,
      email,
      password,
      });
      setSuccessMessage(response.data.message);
      console.log(response)
      toast.success("refistrering fullført");
      navigate('/LoginForm');
    } catch (error) {
      setError('Failed to register. Please try again.');
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
      <p className='har'>Har du allerede bruker?<Link to="/LoginForm" className='link'>Log in her</Link></p>
      {error && <div className='error'>{error}</div>}
      {successMessage && <div className='success'>{successMessage}</div>}
    </div>
  );
};

export default RegistrationForm;
