import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/signin.css'

interface loginProps {
    onLogin: () => void
}

const Signin = ({ onLogin }: loginProps) => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState({
        email: false,
        password: false
    });
    const [apiError, setApiError] = useState('');

    // Si l'utilisateur clique sur le boutton se connecte
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validation de l'email et du mot de passe avant l'envoi
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const isPasswordValid = password.trim().length > 0;

        // Verification si l'un des ces champ est vide
        if (!isEmailValid || !isPasswordValid) {
            setError({
                email: !isEmailValid,
                password: !isPasswordValid
            });
            return;
        }

        // Stovkage des valeurs sur champ de texte dans data
        const data = { email, password };
        console.log(data);

        // Envoi des donnees au backend
        try {
            const response = await axios.post('http://localhost:5000/api/signin', data, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log('Données envoyées:', data);

            if (response.status === 200) {
                // Connecté avec succès, rediriger ou stocker le token
                console.log("Connexion réussie");
                // Quand le condition est vrai il ouvre la liste
                if (onLogin) onLogin()
                //Stocker le token
                const token = response.data.token;
                localStorage.setItem('token', token);
            } else {
                console.log("Erreur de connexion :", response.data);
            }
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) {
                console.log("Détails de l'erreur :", error.response.data);
                setApiError(error.response.data.error);
            } else {
                console.log("Erreur inconnue", error);
            }
        }
        // Vider les champs apres l'envoi des donness
        setEmail('')
        setPassword('')
    };

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
        }}>
            <Box sx={{
                backgroundColor: '#fff',
                borderRadius: '10px',
                boxShadow: '0px 2px 15px #4078ae',
                width: { xs: '300px', sm: '400px', md: '400px' },
                height: '60vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
            }}>
                <Typography component='h1' sx={{ fontSize: '2rem' }}>Connexion</Typography>
                <Box component='form' onSubmit={handleSubmit}>
                    <Typography>Votre email</Typography>
                    <TextField
                        placeholder='Entrez votre email valide'
                        name='email'
                        margin="dense"
                        value={email}
                        type='email'
                        onChange={(e) => setEmail(e.target.value)}
                        error={error.email}
                        helperText={error.email ? 'Email invalide' : ''}
                        sx={{ width: { sm: '300px', md: '300px' } }}
                    />
                    <Typography>Votre mot de passe</Typography>
                    <TextField
                        placeholder='Entrez votre mot de passe'
                        name='password'
                        margin="dense"
                        value={password}
                        type='password'
                        onChange={(e) => setPassword(e.target.value)}
                        error={error.password}
                        helperText={error.password ? '*Mot de passe obligatoire' : ''}
                        sx={{ width: { sm: '300px', md: '300px' } }}
                    />
                    {apiError && <Typography color="red">{apiError}</Typography>}<br />
                    <Box sx={{ padding: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button type='submit' variant='contained' >Se connecter</Button>
                    </Box>
                </Box>
                <Box>
                    <Link to='/signup'>Créer un compte</Link>
                </Box>
            </Box>
        </Box>
    );
};

export default Signin;
