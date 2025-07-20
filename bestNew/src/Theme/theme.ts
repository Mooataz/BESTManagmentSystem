import { createTheme } from '@mui/material/styles';

// Crée un thème personnalisé
const theme = createTheme({
  palette: {
    primary: {
      main: '#0D47A1',  // Couleur principale (par exemple, un bleu)
    },
    secondary: {
      main: '#66BB6A',  // Couleur secondaire (par exemple, un rose)
    },
     info: {
      main: '#FAFAFA',  // Couleur tertiaire (par exemple, un orange)
    },
    background: {
      default: '#FAFAFA',  // Couleur de fond
    },
    
    text: {
      primary: '#333',  // Couleur du texte principal 
      secondary: '#555',  // Couleur du texte secondaire
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Police utilisée
    h1: {
      fontSize: '3rem',  // Taille des titres h1
      fontWeight: 500,
    },
    h2: {
      fontSize: '2.5rem',  // Taille des titres h2
    },
  },
  spacing: 8,  // Définit l'échelle d'espacement
});

export default theme;
