import React, { useState, useEffect } from 'react';
import './Takk.css';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const Takk: React.FC = () =>  {
    return(
        <div className='Takk_side'>
            <h1>Takk for din bestilling!</h1>
            <h3>Du vil få en epost med bekreftelse snart</h3>
        </div>
    );
}

export default Takk;