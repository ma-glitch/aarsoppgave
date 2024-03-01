import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Nav.module.css';
import { useCookies } from 'react-cookie';
import logo from '../assets/png/logowhite_green.png';
import { useNavigate } from 'react-router-dom';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { IoBagOutline } from 'react-icons/io5';

interface handleitem {
  antall: number;
}

const Nav: React.FC<{}> = () => {
  const [cookies] = useCookies(['Fornavn']);
  const [cookie] = useCookies(['Ansatt']);
  const [cooki] = useCookies(['Loggedin']);
  const [cookis] = useCookies(['Etternavn']);
  const [cookiess] = useCookies(['Kundeid']);
  const username: string | undefined = cookies['Fornavn'];
  const ansatt: string | undefined = cookie['Ansatt'];
  const loggedin: string | undefined = cooki['Loggedin'];
  const etternavn: string | undefined = cookis['Etternavn'];
  const navigate = useNavigate();
  const [data, setData] = useState<handleitem[]>([]);

  const renderUserInitial = () => {
    if (ansatt === 'yes') {
      return (
        <div>
          <Link to="/Ansatt">Ansatt</Link>
        </div>
      );
    } else {
      if (username) {
        const initial = username.charAt(0).toUpperCase();
        const initial2 = etternavn?.charAt(0).toLocaleUpperCase();
        return (
          <div className={styles['user-initial']}>
            <Link to="/MinSide"> {initial}{initial2}</Link>
          </div>
        );
      } else {
        return (
          <div className={styles['login-text']}>
            <Link to="/LoginForm">Login</Link>
          </div>
        );
      }
    }
  };

  const Handlekurvlog = () => {
    if (loggedin === 'yes') {
      return navigate('/Handlekurv');
    } else {
      toast.error('Du må logge inn for å se handlekurven');
    }
  };

const shippingpris = 0;

  const getTotalItems = () => {
    return data.reduce((total, item) => {
      const handlepris = Math.round(item.antall);
      return total + handlepris;
    },shippingpris);
  };

  const gethandleItems = async () => {
    if (loggedin === 'yes'){
    try {
      const customerId = cookiess['Kundeid'];
      const response = await axios.get(`http://10.200.1.117:8000/vis_handle.php?customerId=${customerId}`);
      setData(response.data);
      
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  } else{
    return 0;
  }
  };

  useEffect(() => {
    gethandleItems();
  }, [cookiess]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      gethandleItems();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles['links-container']}>
        <div className={styles['logo-container']}>
          <Link to="/"><img src={logo} alt="logo bilde" /></Link>
        </div>

        <div className={styles['links-center']}>
          <div className={styles['link']}>
            <Link to="/">Hjem</Link>
          </div>
          <div className={styles['link']}>
            <Link to="/produkter">Produkter</Link>
          </div>
          <div className={styles['link']}>
            {renderUserInitial()}
          </div>
        </div>

        <div className={styles['links-right']}>
          <div className={styles['link']}>
            <a onClick={Handlekurvlog}>
            <IoBagOutline />
            <p className={styles['notification']}>{getTotalItems()}</p>
            </a>
          </div>
        </div>
      </div>
      <ToastContainer position='top-center'
        limit={10}
        autoClose={5000}
        newestOnTop
        theme='colored'
        closeOnClick
        pauseOnHover
        transition={Bounce} />
    </nav>
  );
}

export default Nav;
