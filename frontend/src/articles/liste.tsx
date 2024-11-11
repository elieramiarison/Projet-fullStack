import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import BasicModal from './addArticles';
import axios from 'axios';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

interface dataProps {
  id: number;
  name: string;
  quantity: number
}

export default function Liste() {
  const [donne, setDonne] = useState<dataProps[]>([]);
  const [toggle, setToggle] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [NewQuantity, setNewQuantity] = useState('')
  const [id_, setId_] = useState<number | null>(null)
  const [err, setErr] = useState({
    newName: false,
    NewQuantity: false
  })

  // Pour l'ouverure et fermeture du Modal
  const handleOpen = () => setModalOpen(true)
  const handleClose = () => setModalOpen(false)

  // Fonction pour suppression d'article
  const handleDelete = async (id: number) => {

    try {
      await axios.delete(`http://localhost:5000/api/articles/${id}`)
      setDonne(donne.filter(item => item.id !== id))
      console.log("Article supprimé avec succès");
    } catch (err: any) {
      console.error("Erreur lors de la suppression", err.message);
    }
  }

  // Fonction pour mis a jour d'article
  const handleUpdate = async (id: number) => {
    const updateData = { name: newName, quantity: Number(NewQuantity) }
    const isNewNameEmpty = newName === ''
    const isNewQuantity = NewQuantity === ''

    // Verification que champ du mis a jour est vide
    if (isNewNameEmpty || isNewQuantity) {
      setErr({
        newName: isNewNameEmpty,
        NewQuantity: isNewQuantity
      })
      return
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/articles/${id}`, updateData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.status === 200) {
        // Si le mis a jour est ok, le champ du texte ferme
        setToggle(toggle ? false : true)
        console.log('Article mis à jour avec succès');
        // Affichage du nouvelle valeur sur le tableau
        setDonne(donne.map(item => item.id === id ? { ...item, ...updateData } : item));
      }
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de l'article:", error.message);
    }
  }

  // Quand l'utilisateur annule la modification
  const handleCancel = (id: number) => {
    setToggle(toggle ? false : true)
    setId_(id)
  }

  // Affichage du nouveau article sur le tableau 
  const handleAddArticle = (article: dataProps) => {
    setDonne(prevDonne => [...prevDonne, article]);
    window.location.reload()
    console.log("Données après ajout :", donne);
  };

  // Appel de l'API pour recupere les donnes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/articles');
        const data = await response.json();
        console.log("Données récupérées :", data);
        setDonne(data);
      } catch (err: any) {
        console.log("Il y a des erreurs", err.message);
      }
    };
    fetchData();
  }, []);


  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      height: '100vh',
    }}>
      <Button variant='contained' onClick={handleOpen} sx={{ top: '-5rem' }}>Ajouter un article</Button>
      <BasicModal open={isModalOpen} onClose={handleClose} onAddArticle={handleAddArticle} />
      <Box sx={{ width: { xs: 350, sm: 500, md: 500 } }}>
        <TableContainer component={Paper}>
          <Table aria-label="customized table">
            <TableHead color="primary">
              <TableRow>
                <StyledTableCell>Nom</StyledTableCell>
                <StyledTableCell align="right">Quantite</StyledTableCell>
                <StyledTableCell align="right">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {donne.map((item, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell component="th" scope="row">
                    {toggle && id_ === item.id ? <TextField error={err.newName} helperText={err.NewQuantity ? "Nouveau article vide" : ''} type='text' value={newName} onChange={(e) => setNewName(e.target.value)} /> : item.name ? item.name : "Chargement..."}
                  </StyledTableCell>
                  <StyledTableCell align="center">{toggle && id_ === item.id ? <TextField error={err.NewQuantity} helperText={err.NewQuantity ? "Nouveau quantite vide" : ''} type='number' value={NewQuantity} onChange={(e) => setNewQuantity(e.target.value)} /> : item.quantity ? item.quantity : "Chargement..."}</StyledTableCell>
                  <StyledTableCell align="center">
                    {toggle && id_ === item.id ?
                      <div>
                        <Button onClick={() => handleUpdate(item.id)}>Ok</Button>
                        <Button onClick={() => handleCancel(item.id)}>Annuler</Button>
                      </div>
                      :
                      <div>
                        <Button onClick={() => handleCancel(item.id)}>Modifier</Button>
                        <Button onClick={() => handleDelete(item.id)}>Supprimer</Button>
                      </div>}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer >
      </Box>
    </Box>
  );
}
