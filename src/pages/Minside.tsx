import React, { useState, useEffect } from 'react';
import './MinSide.css';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface BestillData {
    bestillingsid: number;
    navn: string;
    bilde: string;
    pris: number;
    dato: string;
    levering_adresse: string;
    antall: number;
    fornavn: string;
    etternavn: string;
}

const MinSide: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<BestillData[]>([]);
    const [cookies, setCookie, removeCookie] = useCookies(['Kundeid', 'Fornavn', 'Etternavn', 'Loggedin', 'Epost', 'Ansatt']);

    const getCustomerId = () => {
        const kundeid: string | undefined = cookies['Kundeid'];
        return kundeid;
    };

    useEffect(() => {
        const customerId = getCustomerId();
        axios.get('http://localhost:8000/server/bestillinger.php', {
            params: {
                customerId: customerId,
            }
        })
            .then(res => {
                setData(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    const groupedOrders = data.reduce((acc, order) => {
        const key = order.bestillingsid;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(order);
        return acc;
    }, {} as { [key: number]: BestillData[] });

const logut = () => {
    try{
    removeCookie('Kundeid');
    removeCookie('Fornavn');
    removeCookie('Etternavn');
    removeCookie('Loggedin');
    removeCookie('Epost');
    removeCookie('Ansatt');
    navigate('/');
    } catch {
        toast.error('Noe gikk feil');
    }
}

    return (
        <div>
            <button onClick={logut}>Log ut</button>
        <h2>Mine Bestillinger</h2>
        <div className="bestillinger-wrapper">
            {Object.values(groupedOrders).map((orders, index) => (
                <div key={index} className="ordre">
                    {orders.map((item, subIndex) => (
                        <div key={subIndex}>
                            <div className="order-details">
                                {subIndex === 0 && (
                                    <>
                                    <div className='Bestillid'>
                                        <h2>Ordre nummer: {item.bestillingsid}</h2>
                                    </div>
                                    <div className='Bestillinfo'>
                                        <p className='navn'>Navn på bestilling: {item.fornavn} {item.etternavn}</p>
                                        <p className='adresse'>Delivery Address: {item.levering_adresse}</p>
                                        <p><strong>Bestillings dato:</strong> {item.dato}</p>
                                    </div>
                                    </>
                                )}
                                <div className="product-details">
                                    <img src={item.bilde} alt="Product" />
                                    <div>
                                        <p>Pris: {item.pris} KR</p>
                                        <p>Antall: {item.antall}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="total-price">
                        <p>Total Price: {orders.reduce((total, item) => total + (item.pris * item.antall), 0)} KR</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
    
    );
}

export default MinSide;
