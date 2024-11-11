import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

const Signup = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState({
        name: false,
        email: false,
        password: false
    });
    const navigate = useNavigate()

    // Quand l'utilisateur deja un compte il revenir sur le formulaire de connexion
    const handleCancel = () => {
        navigate('/signin')
    }

    // Quand l'utilisateur clique sur le  button s'inscrire
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Vo clique");

        // Validation de l'email et du mot de passe sur regex avant envoi
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const isPasswordValid = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{5,}$/.test(password);
        const isNameEmpty = name === '';

        // Verification de l'email, mot de passe et non
        if (!isEmailValid || !isPasswordValid || isNameEmpty) {
            setError({
                name: isNameEmpty,
                email: !isEmailValid,
                password: !isPasswordValid
            });
            return;
        }

        const data = { name, email, password };

        // Envoi des donnees au backend
        try {
            const response = await axios.post('http://localhost:5000/api/signup', data, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log('Données envoyées:', data);

            if (response.status === 201) {
                console.log("Inscription réussie !");
                // Stocker le token (si fourni) et rediriger
                const token = response.data.token;
                if (token) {
                    localStorage.setItem('token', token);
                }
                // Redirection vers la page liste
                navigate('/liste');
                // Ajouter une redirection ou un message de confirmation ici si nécessaire
            } else {
                console.log("Échec :", response.data);
            }
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                console.log("Il y a des erreurs :::", error.message);
            } else {
                console.log("Erreur inconnue", error);
            }
        }
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
                width: { xs: '500px', sm: '600px', md: '600px' },
                height: '90vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
            }}>
                <Typography component='h1' sx={{ fontSize: '2.5rem' }}>Inscription</Typography>
                <Box component='form' onSubmit={handleSubmit}>
                    <Typography>Votre nom</Typography>
                    <TextField
                        placeholder='Entrez votre nom'
                        name='name'
                        margin="dense"
                        value={name}
                        type='text'
                        onChange={(e) => setName(e.target.value)}
                        error={error.name}
                        helperText={error.name ? "*Nom obligatoire" : ''}
                        sx={{ width: { sm: '400px', md: '400px' } }}
                    />
                    <Typography>Votre email</Typography>
                    <TextField
                        placeholder='Entrez votre email valide'
                        name='email'
                        margin="dense"
                        value={email}
                        type='email'
                        onChange={(e) => setEmail(e.target.value)}
                        error={error.email}
                        helperText={error.email ? '*Email invalide' : ''}
                        sx={{ width: { sm: '400px', md: '400px' } }}
                    />
                    <Typography>Votre mot de passe</Typography>
                    <TextField
                        placeholder='Mot de passe ayant un majuscule un caractere speciaux '
                        name='password'
                        margin="dense"
                        value={password}
                        type='password'
                        onChange={(e) => setPassword(e.target.value)}
                        error={error.password}
                        helperText={error.password ? '*Le mot de passe doit contenir au moins 5 caractères, une majuscule et un chiffre' : ''}
                        sx={{ width: { sm: '400px', md: '400px' } }}
                    /><br />
                    <Box sx={{ padding: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Button type='submit' variant='contained'>S'inscrire</Button>
                    </Box>
                </Box>
                <Box>
                    <Button onClick={handleCancel}>J'ai déjà un compte</Button>
                </Box>
            </Box>
        </Box>
    );
};

export default Signup;
