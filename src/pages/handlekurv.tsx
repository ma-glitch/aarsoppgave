import React, { useState, useEffect } from 'react';
import './handlekurv.css';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom'; 

interface HandleData {
    produktid: number;
    navn: string;
    pris: number;
    antall: number;
}

const Handlekurv: React.FC = () => {
    const [data, setData] = useState<HandleData[]>([]);
    const [cookies] = useCookies(['Kundeid']);

    const getCustomerId = () => {
        const kundeid: string | undefined = cookies['Kundeid'];
        return kundeid;
    };

    useEffect(() => {
        const customerId = getCustomerId();
        axios.get('http://localhost:8000/server/handlekurv.php', {
            params: {
                customerId: customerId,
            }
        })
        .then(res => {
            setData(res.data); 
        })
        .catch(err => console.log(err));
    }, []);

    const updateQuantity = (productId: number, newQuantity: number) => {
        const customerId = getCustomerId();
        axios.post('http://localhost:8000/server/update_antall.php', {
            customerId: customerId,
            productId: productId,
            newQuantity: newQuantity
        })
        .then(res => {
            axios.get('http://localhost:8000/server/handlekurv.php', {
                params: {
                    customerId: customerId,
                }
            })
            .then(res => {
                setData(res.data); 
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    };

    const removeItem = (productId: number) => {
        const customerId = getCustomerId();
        axios.post('http://localhost:8000/server/fjern_handle.php', {
            customerId: customerId,
            productId: productId,
        })
        .then(res => {
            setData(data.filter(item => item.produktid !== productId));
        })
        .catch(err => console.log(err));
    };

    const totalPrice = data.reduce((total, item) => {
        return total + item.pris * item.antall;
    }, 0);


    return (
        <div className="shopping-cart">
        <h1 className='cart-title'>Handlekurv</h1>
        <div className="cart-items">
            {data.map(handle => (
                <div className="cart-item" key={handle.produktid}>
                    <div className="item-details">
                        <div className="item-name">{handle.navn}</div>
                        <div className="item-price">{handle.antall * handle.pris} KR</div>
                        <div className='quantity-container'>
                        <div className="item-quantity"><input
                                type="number" 
                                min="0" 
                                value={handle.antall} 
                                onChange={(e) => updateQuantity(handle.produktid, parseInt(e.target.value))}
                            /></div>
                        </div>
                    </div>
                    <button className="remove-button" onClick={() => removeItem(handle.produktid)}>Remove</button>
                </div>
            ))}
        </div>
        <div className="cart-summary">
            <div className="total-price">Total:  {totalPrice} KR</div>
            <Link to="/betaling">
                <button className="checkout-button">Gå til betaling</button>
            </Link>
            <Link to="/">
                <button className="back-button">Fortsett å handle</button>
            </Link>
        </div>
    </div>
    );
};

export default Handlekurv;
