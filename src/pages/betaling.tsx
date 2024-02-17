import React, {useEffect, useState } from 'react';
import './betaling.css';
import axios from 'axios';
import { useCookies } from 'react-cookie';


interface ShippingOption {
    id: number;
    name: string;
    price: number;
}

interface Produkter {
    produktid: number;
    navn: string;
    pris: number;
    antall: number;
}


const Betaling: React.FC = () => {
    const [address, setadress] = useState('');
    const [cookies] = useCookies(['Kundeid']);
    const [data, setData] = useState<Produkter[]>([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [selectedShippingOption, setSelectedShippingOption] = useState<ShippingOption | null>(null);

    useEffect(() => {
        const getCartItems = async () => {
            try {
                const customerId = cookies['Kundeid'];
                const response = await axios.get(`http://localhost:8000/server/vis_handle.php?customerId=${customerId}`);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        getCartItems();
    }, [cookies]);

    const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPaymentMethod(event.target.value);
    };

    const handleShippingOptionChange = (option: ShippingOption) => {
        setSelectedShippingOption(option);
    };


    const handleRemoveItem = (productId: number) => {
        const customerId = cookies['Kundeid'];
        axios.post('http://localhost:8000/server/fjern_handle.php', {
            customerId: customerId,
            productId: productId,
        })
        .then(res => {
            setData(data.filter(item => item.produktid !== productId));
        })
        .catch(err => console.log(err));
    };

    const totalpris = data.reduce((total, item) => {
        const shippingpris= selectedShippingOption ? selectedShippingOption.price : 0;
        const handlepris = (item.pris * item.antall);
        return total + shippingpris + handlepris;
    }, 0);

    const handleadresschange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setadress(event.target.value);
      };

    const handlePayment = async () => {
        try {
            const customerId = cookies['Kundeid'];
            const orderData = {
              customerId,
              shippingAddress: address,
              products: data.map(item => ({ produktid: item.produktid, antall: item.antall })),
              shippingOption: selectedShippingOption
            };
            await axios.post('http://localhost:8000/server/betaling.php', orderData);
            
          } catch (error) {
            console.error('Error placing order:', error);
            
          }
    };

    const oppdaterantall = (productId: number, newQuantity: number) => {
        const customerId = cookies['Kundeid'];
        axios.post('http://localhost:8000/server/update_antall.php', {
            customerId: customerId,
            productId: productId,
            newQuantity: newQuantity
        })
        .then(res => {
            axios.get('http://localhost:8000/server/vis_handle.php', {
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


    
    return (
        <div className="checkout-container">
            <h1>Checkout</h1>
            <div className="shipping-section">
                <h2>Delivery Method</h2>
                <div className="shipping-options">
                    <label>
                        <input type="radio" name="shipping" checked={selectedShippingOption?.id === 1} onChange={() => handleShippingOptionChange({ id: 1, name: 'Hjemmelevering', price: 50 })} />
                        Hjemmelevering (50)
                    </label>
                    <input type="text" name="adress" value={address} onChange={handleadresschange}/>
                    <label>
                        <input type="radio" name="shipping" checked={selectedShippingOption?.id === 2} onChange={() => handleShippingOptionChange({ id: 2, name: 'Prioritet Hjemmelevering', price: 150 })} />
                        Prioritet Hjemmelevering (150)
                    </label>
                </div>
            </div>
            <div className="cart-section">
                <h2>Shopping Cart</h2>
                <ul className="cart-items">
                    {data.map(item => (
                        <li key={item.produktid}>
                            <span>{item.navn}</span>
                            <span>{item.pris * item.antall} Kr</span>
                            <div className="item-quantity"><input
                                type="number" 
                                min="0" 
                                value={item.antall} 
                                onChange={(e) => oppdaterantall(item.produktid, parseInt(e.target.value))}
                            /></div>
                            <button onClick={() => handleRemoveItem(item.produktid)}>Remove</button>
                        </li>
                    ))}
                </ul>
                <div className="total-price">Total: {totalpris}</div>
            </div>
            <div className="payment-section">
                <h2>Payment Method</h2>
                <div className="payment-methods">
                    <label>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="creditCard"
                            checked={selectedPaymentMethod === 'creditCard'}
                            onChange={handlePaymentMethodChange}
                        />
                        Credit Card
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="paypal"
                            checked={selectedPaymentMethod === 'paypal'}
                            onChange={handlePaymentMethodChange}
                        />
                        PayPal
                    </label>
                </div>
                <div className="payment-section">
                    <button className="pay-now-button" onClick={handlePayment}>Pay Now</button>
                </div>
            </div>
        </div>
    );
};

export default Betaling;
