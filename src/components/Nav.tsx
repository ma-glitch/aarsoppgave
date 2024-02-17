import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Nav.module.css';
import { useCookies } from 'react-cookie';
import MinSide from '../pages/Minside';
import logo from '../assets/png/logowhite_green.png';



const Nav: React.FC<{}> = () => {
  const [cookies] = useCookies(['Fornavn']);
  const [cookie] = useCookies(['Ansatt']);
  const username: string | undefined = cookies['Fornavn']; 
  const ansatt: string | undefined = cookie['Ansatt']; 

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
      return (
        <div className={styles['user-initial']}>
          <Link to="/MinSide"> {initial}</Link>
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
  
  return (
    <nav className={styles.navbar}>
      <div className={styles['logo-container']}>
        <Link to="/"><img src={logo} alt="logo bilde" /></Link>
      </div>
      <div className={styles['links-container']}>
        <div className={styles['link']}>
          <Link to="/">Hjem</Link>
        </div>
        <div className={styles['link']}>
          <Link to="/produkter">Produkter</Link>
        </div>
        <div className={styles['link']}>
          <Link to="/Handlekurv">Handlekurv</Link>
        </div>
        <div className={styles['link']}>
          {renderUserInitial()}
        </div>
      </div>
    </nav>
  );
}

export default Nav;
