import React, { useState, useEffect } from 'react';
import './produkter.css';
import axios from 'axios';
import SidePanel from './sidepanel';
import { useCookies } from 'react-cookie';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface ProduktData {
  produktid: number;
  navn: string;
  pris: number;
  bilde: string;
  kjonn: string;
  farge: string;
  merke: string;
  rabatt: number;
}

const Produkter: React.FC = () => {
  const [data, setData] = useState<ProduktData[]>([]);
  const [filteredData, setFilteredData] = useState<ProduktData[]>([]);
  const [cookies] = useCookies(['Kundeid']);

  useEffect(() => {
    axios.get('http://localhost:8000/server/produkter.php')
      .then(res => {
        setData(res.data);
        setFilteredData(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  const handleFilterChange = (filters: any) => {
    let filteredProducts = data;

    if (filters.price && filters.price.length > 0) {
      filteredProducts = filteredProducts.filter(product => filters.price.includes(getPriceRange(product.pris)));
    }

    if (filters.color && filters.color.length > 0) {
      filteredProducts = filteredProducts.filter(product => filters.color.includes(product.farge));
    }

    if (filters.kjonn && filters.kjonn.length > 0) {
      filteredProducts = filteredProducts.filter(product => filters.kjonn.includes(product.kjonn));
    }
    if (filters.merke && filters.merke.length > 0) {
      filteredProducts = filteredProducts.filter(product => filters.merke.includes(product.merke));
    }

    setFilteredData(filteredProducts);
  };

  const getPriceRange = (price: number) => {
    if (price <= 500) {
      return '0-500';
    } else if (price > 500 && price <= 1000) {
      return '500-1000';
    } else if (price > 1000 && price <= 1500) {
      return '1000-1500';
    } else if (price > 1500 && price <= 2000) {
      return '1500-2000';
    } else if (price > 2000 && price <= 2500) {
      return '2000-2500';
    }
  };

  const getCustomerId = () => {
    const kundeid: string | undefined = cookies['Kundeid'];
    return kundeid;
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
        toast.success("Lagt i Handlekurv!");
      })
      .catch(err => console.log(err));
    } else {
      console.log('Customer ID not found.');
    }
  };
  
  const rabattregning = (product: ProduktData) => {
    if (product.rabatt > 0) {
      const discountedPrice = Math.round(product.pris * (1 - product.rabatt));
      return (
        <div>
          <p className='produkt-pris'>
            <span style={{ textDecoration: 'line-through', color: 'red' }}>
              {product.pris} KR
            </span>
            {' '}
            {discountedPrice} KR ({product.rabatt * 100}% rabatt)
          </p>
        </div>
      );
    } else {
      return (
        <p className='produkt-pris'>{product.pris} KR</p>
      );
    }
  }

  return (
    <div className="produkter">
      <SidePanel onFilterChange={handleFilterChange} />
      <div className="produkter-index">
        {filteredData.map(product => (
          <div key={product.produktid} className="produkt-kort">
            <img src={product.bilde} alt={product.navn} className='produkt-bilde' />
            <div className='produkt-info'>
              <div>
            <h3 className='produkt-navn'>{product.navn}</h3>
            <div className='rabatt'>
              {rabattregning(product)}
            </div>
            <p className='produkt-kjonn'>Sko for {product.kjonn}</p>
            </div>
            <button onClick={() => addToCart(product.produktid)}>Legg i Handlekurv</button>
            </div>
          </div>
        ))}
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
  );
}

export default Produkter;
