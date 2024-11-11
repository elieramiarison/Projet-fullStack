import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';

interface dataProps {
    id: number;
    name: string;
    quantity: number
}

interface BasicModalProps {
    open: boolean;
    onClose: () => void;
    onAddArticle: (article: dataProps) => void;
}

export default function BasicModal({ open, onClose, onAddArticle }: BasicModalProps) {
    const [nameArticle, setNameArticle] = useState('');
    const [quantity, setQuantity] = useState('');
    const [error, setError] = useState({
        nameArticle: false,
        quantity: false
    });

    // Si l'utilisateur clique sur le boutton Ajouter
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Stackage des valeurs sur les champs du texte sur data
        const data = { name: nameArticle, quantity: Number(quantity) };

        const isNameArticleEmpty = nameArticle === ''
        const isQuantityArticleEmpty = quantity === ''

        setError({
            nameArticle: isNameArticleEmpty,
            quantity: isQuantityArticleEmpty
        });

        // Verification si l'un de ces champs est vide
        if (!nameArticle || !quantity) {
            return;
        }

        // Envoi des donnes au base de donnee
        try {
            const response = await axios.post('http://localhost:5000/api/articles', data, {
                headers: {
                    "Content-Type": "application/json"
                },
            });
            console.log('Données envoyées:', data);
            // Verification si les donnee sont bien envoyee
            if (response.status === 201) {
                console.log("Réussite");
                onClose()
                setNameArticle('');
                setQuantity('');
                onAddArticle(response.data)
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
        <div>
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItem: 'center',
                    flexDirection: 'column',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: 200, sm: 400, md: 400 },
                    height: 300,
                    bgcolor: 'background.paper',
                    // border: '1px solid #000',
                    borderRadius: '10px',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography id="modal-modal-title" variant="h5" component="h2" sx={{ textAlign: 'center', paddingBottom: '15px' }}>
                        Ajouter un article
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Nom d'article"
                            placeholder="Entrez le nom d'article"
                            value={nameArticle}
                            onChange={(e) => setNameArticle(e.target.value)}
                            error={error.nameArticle}
                            helperText={error.nameArticle ? "*Nom obligatoire" : ""}
                            fullWidth
                            margin="dense"
                        />
                        <TextField
                            label="Quantité"
                            placeholder="Entrez la quantité"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            error={error.quantity}
                            helperText={error.quantity ? "*Quantité obligatoire" : ""}
                            fullWidth
                            margin="dense"
                        />
                        <Box sx={{ padding: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Button type='submit' variant="contained" sx={{ mt: 2 }}>
                                Ajouter
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}
