import React, { useState, useEffect } from 'react';
import './hjem.css';
import axios from 'axios';


interface ProduktData {
    produktid: number;
    navn: string;
    pris: number;
    bilde: string;
    kjonn: string;
    rabatt: number;
  }
  
  function Hjem() {
    const [data, setData] = useState<ProduktData[]>([]);
  
    useEffect(() => {
      axios.get('http://localhost:8000/server/tilbud.php')
        .then(res => {
          setData(res.data);
        })
        .catch(err => console.log(err));
    }, []);

    const rabattregning = (item: ProduktData) => {
      if (item.rabatt > 0) {
        const discountedPrice = Math.round(item.pris * (1 - item.rabatt));
        return (
          <div>
            <p className='produkt-pris'>
              <span style={{ textDecoration: 'line-through', color: 'red' }}>
                {item.pris} KR
              </span>
              {' '}
              {discountedPrice} KR ({item.rabatt * 100}% rabatt)
            </p>
          </div>
        );
      } else {
        return (
          <p className='produkt-pris'>{item.pris} KR</p>
        );
      }
    }
  
    return (
    <div>
  
  <p className='populaare'>Produkter på tilbud</p>
  
    <div className='produkter-index'>
          {data.map(item => (
            
            <div key={item.produktid}>
              <div className='produkt-kort'>
               <img className='produkt-bilde' src={item.bilde} alt="produkt bilde" />
              <div className='produkt-info'>
                <div className='produkt-navn'>{item.navn}</div>
                <div className='rabatt'> 
                {rabattregning(item)}
                </div>
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