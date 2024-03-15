import React from "react";
import { Link } from 'react-router-dom';
import './MinSide.css';

const MinNav: React.FC = () => {
    return(
        <div className="Nav">
        <div className="link">
            <Link to='/Innstillinger'>Innstillinger</Link>
        </div>
        <div className="link">
            <Link to='/Bestillinger'>Bestillinger</Link>
        </div>
        </div>
    );
}

export default MinNav;