import React, { useState, useEffect } from 'react';
import './hjem.css';
import axios from 'axios';


interface ProduktData {
    produktid: number;
    navn: string;
    pris: number;
    bilde: string;
    kjonn: string;
  }
  
  function Hjem() {
    const [data, setData] = useState<ProduktData[]>([]);
  
    useEffect(() => {
      axios.get('http://localhost:8000/server/produkter.php')
        .then(res => {
          setData(res.data);
        })
        .catch(err => console.log(err));
    }, []);
  
    return (
    <div>
  
  
  
    <div className='produkter-index'>
          {data.map(item => (
            <div key={item.produktid}>
              <div className='produkt-kort'>
               <img className='produkt-bilde' src={item.bilde} alt="produkt bilde" />
              <div className='produkt-info'>
                <div className='produkt-navn'>{item.navn}</div>
                <div className='produkt-pris'>{item.pris} KR</div>
                <div className='produkt-kjonn'>Sko for {item.kjonn}</div>
              </div>
              </div>
            </div>
          ))}
      </div>
  
    </div>
    );
  }

  export default Hjem;