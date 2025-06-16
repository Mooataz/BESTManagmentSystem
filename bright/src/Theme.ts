import { createTheme } from "@mui/material";
//color design tokens
//import { extendTheme } from '@mui/joy/styles';
 
  export const theme = createTheme(
    {
palette:{
    primary: {
        main: "#135188",
      },
 secondary: {
    main: "#78BF3F",
  } 
},
typography:{
fontFamily:'"Roboto","Helvetica","Arial",sans-serif',   
h1:{
  fontFamily:"inter",
    fontSize:40,
    color:"#1A9BC3",
},
h2:{
  fontFamily:"inter",
    fontSize:25,
    color:"#1A9BC3",
    textAlign:"center",
    fontWeight:"bold"
},
h3:{
    fontFamily:"inter",
    fontSize:24,
    color:"#080D50",
    fontWeight:"bold",
    marginBottom:"10px",
},
h5:{
  fontFamily:"inter",
  fontSize:25,
  color:"#080D50",
  fontWeight:"bold",
  marginBottom:"10px",
  textAlign:"center"
},
h4:{
  fontFamily:"inter",
  fontSize:10,
  color:"#080D50",
  fontWeight:"bold",
},
 
h6:{
  fontFamily:"inter",
  fontSize:14,
  color:"#09759D",
  fontWeight:"bold",
  
},
 
 
},
shape:{
    borderRadius:20
},
spacing:10,
 
 
}
)  
 
 // src/theme/colors.ts

/* export const colors = {
  primary: '#135188',
  primaryHover: '#0f406d',
  secondary: '#78BF3F',
  danger: '#D32F2F',
  info: '#1A9BC3',
  dark: '#080D50',
  textMain: '#09759D',
};
// src/theme/theme.ts
 

export const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          solidBg: colors.primary,
          solidHoverBg: colors.primaryHover,
          plainColor: colors.primary,
        },
        customSecondary: {
          solidBg: colors.secondary,
          plainColor: colors.secondary,
        },
        danger: {
          solidBg: colors.danger,
        },
      },
    },
  },
  fontFamily: {
    display: '"Inter", sans-serif',
    body: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});
 */