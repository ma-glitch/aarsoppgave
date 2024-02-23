import React, { useState, useEffect } from 'react';
import './hjem.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useCookies } from 'react-cookie';


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
  const [popularProducts, setPopularProducts] = useState<ProduktData[]>([]);
  const [cookies] = useCookies(['Kundeid']);


  const getCustomerId = () => {
    const kundeid: string | undefined = cookies['Kundeid'];
    return kundeid;
  };


  useEffect(() => {
    axios.get('http://localhost:8000/server/tilbud.php')
      .then(res => {
        setData(res.data);
      })
      .catch(err => console.log(err));

    axios.get('http://localhost:8000/server/populare_produkter.php')
      .then(res => {
        setPopularProducts(res.data);
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
  };

  const addToCart = (productId: number) => {
    const customerId = getCustomerId();
    if (customerId) {
      axios.post('http://localhost:8000/server/legg_til_handlekurv.php', {
        customerId: customerId,
        productId: productId,
        quantity: 1,
      })
      .then(res => {
        toast.success("Lagt i Handlekurven!");
      })
      .catch(err => console.log(err));
    } else {
      console.log('Customer ID not found.');
    }
  };

  const kjonnvis = (kjonn: string) => {
    if (kjonn === 'mann'){
      return 'Herre';
    } else if (kjonn === 'dame'){
      return 'Dame';
    }
  };


  return (
    <div>
      <div className="banner">
        <h1>Velkommen til SkoDex!</h1>
        <p>Find de perfekte skoende for deg</p>
      </div>
      <div className='produkter'>
      <div className="popular-products">
        <h2>Populære produkter</h2>
        <div className="produkter-index">
        {popularProducts.map(product => (
          <div key={product.produktid} className="produkt-kort">
            <img src={product.bilde} alt={product.navn} className='produkt-bilde' />
            <div className='produkt-info'>
              <div>
            <h3 className='produkt-navn'>{product.navn}</h3>
            <div className='rabatt'>
              {rabattregning(product)}
            </div>
            <p className='produkt-kjonn'>{kjonnvis(product.kjonn)}sko</p>
            </div>
            <button onClick={() => addToCart(product.produktid)}>Legg i Handlekurv</button>
            </div>
          </div>
        ))}
      </div>
        </div>
        </div>

        
      <div className="commercial">
      <h2>Nike red fire Jordan 1</h2>      
      <h1>DU TROR DET NÅR DU PRØVER DEM SELV</h1>
      <button>Kjøp nå</button>
        <img src='https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt="Nyeste sko" className="commercial-image" />
     
      </div>
      
    
      <p className='populaare'>Produkter på salg</p>
      <div className='produkter'>
      <div className="produkter-index">
        {data.map(product => (
          <div key={product.produktid} className="produkt-kort">
            <img src={product.bilde} alt={product.navn} className='produkt-bilde' />
            <div className='produkt-info'>
              <div>
            <h3 className='produkt-navn'>{product.navn}</h3>
            <div className='rabatt'>
              {rabattregning(product)}
            </div>
            <p className='produkt-kjonn'>{kjonnvis(product.kjonn)}sko</p>
            </div>
            <button onClick={() => addToCart(product.produktid)}>Legg i Handlekurv</button>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

export default Hjem;
