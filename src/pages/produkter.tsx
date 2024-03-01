import React, { useState, useEffect } from 'react';
import './produkter.css';
import axios from 'axios';
import SidePanel from './sidepanel';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
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
    axios.get('http://10.200.1.117:8000/produkter.php')
      .then(res => {
        setData(res.data);
        setFilteredData(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  const handleFilterChange = (filters: any) => {
    let filteredProducts = data;

    if (filters.price && filters.price.length > 0) {
      filteredProducts = filteredProducts.filter(product => filters.price.includes(getPriceRange(product.pris, product.rabatt)));
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
    if (filters.rabatt && filters.rabatt.length > 0) {
      filteredProducts = filteredProducts.filter(product => filters.rabatt.includes(getRabatt(product.rabatt)));
    }

    setFilteredData(filteredProducts);
  };

  const getPriceRange = (price: number, rabatt: number) => {
    if (rabatt > 0.1) {
      const discountedPrice = Math.round(price * (1 - rabatt));
      if (discountedPrice <= 500) {
        return '0-500';
      } else if (discountedPrice > 500 && discountedPrice <= 1000) {
        return '500-1000';
      } else if (discountedPrice > 1000 && discountedPrice <= 1500) {
        return '1000-1500';
      } else if (discountedPrice > 1500 && discountedPrice <= 2000) {
        return '1500-2000';
      } else if (discountedPrice > 2000 && discountedPrice <= 2500) {
        return '2000-2500';
      }
    } else {  
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
  }};

  const getRabatt = (rabatt: number) =>{
    if (rabatt > 0.1){
    return '0.1-1';
    }
  };

  const getCustomerId = () => {
    const kundeid: string | undefined = cookies['Kundeid'];
    return kundeid;
  };

  const addToCart = (productId: number) => {
    const customerId = getCustomerId();
    if (customerId) {
      axios.post('http://10.200.1.117:8000/legg_til_handlekurv.php', {
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

  const kjonnvis = (kjonn: string) => {
    if (kjonn === 'mann'){
      return 'Herre';
    } else if (kjonn === 'dame'){
      return 'Dame';
    }
  };

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
            <p className='produkt-kjonn'>{kjonnvis(product.kjonn)}sko</p>
            </div>
            <button onClick={() => addToCart(product.produktid)}>Legg i Handlekurv</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Produkter;
