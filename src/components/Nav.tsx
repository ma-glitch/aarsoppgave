import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Nav.module.css';
import { useCookies } from 'react-cookie';
import MinSide from '../pages/Minside';
import logo from '../assets/png/logowhite_green.png';
import { useNavigate } from 'react-router-dom';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Nav: React.FC<{}> = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['Fornavn']);
  const [cookie] = useCookies(['Ansatt']);
  const [cooki] = useCookies(['Loggedin']);
  const [cookis] = useCookies(['Etternavn'])
  const username: string | undefined = cookies['Fornavn'];
  const ansatt: string | undefined = cookie['Ansatt']; 
  const loggedin: string | undefined = cooki['Loggedin'];
  const etternavn: string | undefined = cookis['Etternavn'];

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

  const Handlekurvlog = () =>{
    if (loggedin === 'yes') {
      return (
        navigate('/Handlekurv')
      )
    } else {
      toast.error('Du må logge in for å se handlekurv');
    }
  }
  
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
          <a onClick={Handlekurvlog}>Handlekurv</a>
        </div>
        <div className={styles['link']}>
          {renderUserInitial()}
        </div>
        <ToastContainer position='top-center'
      limit={10}
      autoClose={5000}
      newestOnTop
      theme='colored'
      closeOnClick
      pauseOnHover
      transition={Bounce} />
      </div>
    </nav>
  );
}

export default Nav;
