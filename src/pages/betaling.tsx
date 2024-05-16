import React, { useEffect, useState } from 'react';
import './betaling.css';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


interface ShippingOption {
  id: number;
  name: string;
  price: number;
}

interface PaymentOption {
  id: number;
  name: string;
}

interface Produkter {
  produktid: number;
  navn: string;
  pris: number;
  antall: number;
  rabatt: number;
}


const Betaling: React.FC = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [shipping, setShipping] = useState();
  const [card, setCard] = useState('');
  const [card2, setCard2] = useState('');
  const [dato, setDato] = useState('');
  const [cookies] = useCookies(['Kundeid']);
  const [data, setData] = useState<Produkter[]>([]);
  const [selectedShippingOption, setSelectedShippingOption] = useState<
    ShippingOption | null
  >(null);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<
    PaymentOption | null
  >(null);

  useEffect(() => {
    const getCartItems = async () => {
      try {
        const customerId = cookies['Kundeid'];
        const response = await axios.get(
          `http://10.200.1.117:8000/vis_handle.php?customerId=${customerId}`
        );
        setData(response.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    getCartItems();
  }, [cookies]);

  const handlePaymentMethodChange = (
    option: PaymentOption,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedPaymentOption(option);
  };

  const handleCardChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCard(event.target.value);
  };

  const handleDatoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDato(event.target.value);
  };

  const handleCard2Change = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCard2(event.target.value);
  };

  const handleShippingOptionChange = (option: ShippingOption) => {
    setSelectedShippingOption(option);
  };

  const handleRemoveItem = (productId: number) => {
    const customerId = cookies['Kundeid'];
    axios
      .post('http://10.200.1.117:8000/fjern_handle.php', {
        customerId: customerId,
        productId: productId,
      })
      .then((res) => {
        setData(data.filter((item) => item.produktid !== productId));
      })
      .catch((err) => console.log(err));
  };


  const shippingpris = selectedShippingOption ? selectedShippingOption.price : 0;

  const totalpris = data.reduce((total, item) => {
    const handlepris = Math.round(item.pris * (1 - item.rabatt)) * item.antall;
    return total + handlepris;
}, shippingpris);



  const handleAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAddress(event.target.value);
  };

  const handleTlfChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAddress(event.target.value);
  };

  const handlePayment = async () => {
    try {
      const customerId = cookies['Kundeid'];

      if (!selectedShippingOption) {
        toast.error("Velg en leverings metode!");
        return;
      }

      if (!address) {
        toast.error("Fyll ut kort adresse!");
        return;
      }

     if (!selectedPaymentOption) {
            toast.error("Velg en betalings metode!");
            return;
          }

      if (!card) {
        toast.error("Fyll ut kort informasjon!");
        return;
      }

      if (!card2) {
        toast.error("Fyll ut sikkerhets kode!");
        return;
      }

      if (!dato) {
        toast.error("Fyll ut dato!");
        return;
      }

      const orderData = {
        customerId,
        shippingAddress: address,
        products: data.map((item) => ({
          produktid: item.produktid,
          antall: item.antall,
        })),
        shippingOption: selectedShippingOption,
        paymentvalg: selectedPaymentOption,
      };
      await axios.post(
        'http://10.200.1.117:8000/betaling.php',
        orderData
      );
      navigate('/Takk');
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const oppdaterAntall = (productId: number, newQuantity: number) => {
    const customerId = cookies['Kundeid'];
    axios
      .post('http://10.200.1.117:8000/update_antall.php', {
        customerId: customerId,
        productId: productId,
        newQuantity: newQuantity,
      })
      .then((res) => {
        axios
          .get('http://10.200.1.117:8000/vis_handle.php', {
            params: {
              customerId: customerId,
            },
          })
          .then((res) => {
            setData(res.data);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };


  const rabattregning = (item: Produkter) => {
    if (item.rabatt > 0) {
      const discountedPrice = Math.round((item.pris * (1 - item.rabatt)) * item.antall);
      return (
        <div>
          <p className='produkt-pris'>
            <span style={{ textDecoration: 'line-through', color: 'red' }}>
              {item.pris * item.antall} KR
            </span>
            {' '}
            {discountedPrice} KR ({item.rabatt * 100}% rabatt)
          </p>
        </div>
      );
    } else {
      return (
        <p className='produkt-pris'>{item.pris * item.antall} KR</p>
      );
    }
  }

  return (
    <div className="checkout-container">
      <h1>Betaling</h1>
      <div className="shipping-section">
        <h2>Leveringsmetode</h2>
        <div className="shipping-options">
          <label>
            <input
              type="radio"
              name="shipping"
              value={shipping}
              checked={selectedShippingOption?.id === 1}
              onChange={() =>
                handleShippingOptionChange({
                  id: 1,
                  name: 'Hjemmelevering',
                  price: 50,
                })
              }
            />
            Hjemmelevering (50 Kr)
          </label>
          {selectedShippingOption?.id === 1 && (
            <input
              placeholder="Leverlings adresse"
              type="text"
              name="adress"
              value={address}
              onChange={handleAddressChange}
            />
          )}
          <label>
            <input
              type="radio"
              name="shipping"
              value={shipping}
              checked={selectedShippingOption?.id === 2}
              onChange={() =>
                handleShippingOptionChange({
                  id: 2,
                  name: 'Prioritet Hjemmelevering',
                  price: 150,
                })
              }
            />
            Prioritet Hjemmelevering (150 Kr)
          </label>
          {selectedShippingOption?.id === 2 && (
            <input
              placeholder="Leverings adresse"
              type="text"
              name="adress"
              value={address}
              onChange={handleAddressChange}
            />
          )}
        </div>
      </div>
      <div className="cart-section">
        <h2>Handlekurv</h2>
        <ul className="cart-items">
          {data.map((item) => (
            <li key={item.produktid}>
              <span>{item.navn}</span>
              <span>{rabattregning(item)}</span>
              <div className="item-quantity">
                <input
                  type="number"
                  min="0"
                  value={item.antall}
                  onChange={(e) =>
                    oppdaterAntall(item.produktid, parseInt(e.target.value))
                  }
                />
              </div>
              <button
                className="fjernbtn"
                onClick={() => handleRemoveItem(item.produktid)}
              >
                Fjern
              </button>
            </li>
          ))}
        </ul>
        <div className="total-price">Total: {totalpris}</div>
      </div>
      <div className="payment-section">
        <h2>Betalingsmetode</h2>
        <div className="payment-methods">
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="creditCard"
              checked={selectedPaymentOption?.id === 1}
              onChange={(e) =>
                handlePaymentMethodChange({ id: 1, name: 'bankkort' }, e)
              }
            />
            Bank kort
          </label>
          {selectedPaymentOption?.id === 1 && (
            <div>
              <input
                placeholder="Kortnummer"
                type="text"
                name="kortnummer"
                value={card}
                onChange={handleCardChange}
              />
              <div className="sidebyside">
                <input
                  placeholder="Sikkerhets kode"
                  type="number"
                  name="sikkerhetskode"
                  value={card2}
                  onChange={handleCard2Change}
                />
                <input
                  placeholder="Dato"
                  type="text"
                  name="dato"
                  value={dato}
                  onChange={handleDatoChange}
                />
              </div>
            </div>
          )}
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="vipps"
              checked={selectedPaymentOption?.id === 2}
              onChange={(e) =>
                handlePaymentMethodChange({ id: 2, name: 'vipps' }, e)
              }
            />
            Vipps
          </label>
          {selectedPaymentOption?.id === 2 && (
            <input
              placeholder="Telefonnummer"
              type="text"
              name="adress"
              onChange={handleTlfChange}
            />
          )}
        </div>
        <div className="payment-section">
          <button
            className="pay-now-button"
            onClick={handlePayment}
          >
            Fullfør Betaling
          </button>
        </div>
      </div>
    </div>
  );
};

export default Betaling;
