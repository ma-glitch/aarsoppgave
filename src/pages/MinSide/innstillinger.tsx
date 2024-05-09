import React, { useState, useEffect } from "react";
import MinNav from "./MinNav";
import "./MinSide.css";
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { updateEmail, updatePassword } from 'firebase/auth';
import { auth } from "../../components/firebase";
import axios from "axios";


const Innstillinger: React.FC = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['Kundeid', 'Fornavn', 'Etternavn', 'Loggedin', 'Epost', 'Ansatt']);
    const navigate = useNavigate();
    const [currentUserEmail, setCurrentUserEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewEmail(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(event.target.value);
    };

    useEffect(() => {
        if (auth.currentUser) {
            setCurrentUserEmail(auth.currentUser!.email!);
        }
    }, [cookies]);

    const handleUpdateEmail = async () => {
        const kundeid = cookies['Kundeid'];
        try {
            await updateEmail(auth.currentUser!, newEmail);
            
            const response = await axios.post('http://10.200.1.117:8000/update_passord.php', {
                newEmail: newEmail,
                kundeid: kundeid,
            });
            if (response.data.success) {
                toast.success('Passordet ble oppdatert.');
            } else {
                toast.error('Noe gikk galt ved oppdatering av passord.');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            toast.error('Noe gikk galt ved oppdatering av database.');
        }
    };

    const handleUpdatePassword = async () => {
        const kundeid = cookies['Kundeid'];
        try {
            await updatePassword(auth.currentUser!, newPassword);
            const response = await axios.post('http://10.200.1.117:8000/update_passord.php', {
                newPassword: newPassword,
                kundeid: kundeid,
            });
            if (response.data.success) {
                toast.success('Passordet ble oppdatert.');
            } else {
                toast.error('Noe gikk galt ved oppdatering av passord.');
            }
        } catch (error) {
            console.error('Error updating password:', error);
            toast.error('Noe gikk galt ved oppdatering av database.');
        }
    };


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


    return(
        <div>
            <MinNav />
            <h1>Innstillinger</h1>
        <div className="Innstillinger-wrapper">
                <div className="emailwrapper">
                    <label htmlFor="newEmail">Ny Epost:</label>
                    <input type="email" id="newEmail" value={newEmail} onChange={handleEmailChange}  placeholder={currentUserEmail} />
                    <button onClick={handleUpdateEmail}>Oppdater Epost</button>
                </div>
                <div className="passwordwrapper ">
                    <label htmlFor="newPassword">Nytt Passord:</label>
                    <input type="password" id="newPassword" value={newPassword} onChange={handlePasswordChange} />
                    <button onClick={handleUpdatePassword}>Oppdater Passord</button>
                </div>
            
        </div>
        <div className="Logout_wrapper">
            <button onClick={logut} className="Logut">Log ut</button>
        </div>
        </div>
    );
}

export default Innstillinger;