import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Nav.module.css';

const Nav: React.FC<{}> = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles['logo-container']}>
        <span>logo</span>
      </div>
      <div className={styles['links-container']}>
        <div className={styles['link']}>
          <Link to="/">Hjem</Link>
        </div>
        <div className={styles['link']}>
          <Link to="/produkter">Produkter</Link>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
