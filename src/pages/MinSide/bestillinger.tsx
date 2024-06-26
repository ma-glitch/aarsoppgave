import React, { useState, useEffect } from 'react';
import './MinSide.css';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import MinNav from './MinNav';

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

const Bestillinger: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<BestillData[]>([]);
    const [cookies, setCookie, removeCookie] = useCookies(['Kundeid', 'Fornavn', 'Etternavn', 'Loggedin', 'Epost', 'Ansatt']);

    const getCustomerId = () => {
        const kundeid: string | undefined = cookies['Kundeid'];
        return kundeid;
    };

    useEffect(() => {
        const customerId = getCustomerId();
        axios.get('http://10.200.1.117:8000/bestillinger.php', {
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


    return (
        <div>
            <MinNav />
        <h2 className='Bestill-header'>Mine Bestillinger</h2>
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
                                        <p className='adresse'>Leverings adresse: {item.levering_adresse}</p>
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
                        <p>Total Pris: {orders.reduce((total, item) => total + (item.pris * item.antall), 0)} KR</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
    
    );
}

export default Bestillinger;
