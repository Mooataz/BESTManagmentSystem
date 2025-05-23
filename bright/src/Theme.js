import { createTheme } from "@mui/material";
//color design tokens
export const theme =createTheme(
    {
palette:{
    primary: {
        main: "#1A9BC3",
      },
 secondary: {
    main: "#52307C",
  },
  tertiary: {
    main: "#080D50", // Couleur orange en exemple
},
},
typography:{
fontFamily:'"Roboto","Helvetica","Arial"',
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
h5:{
  fontFamily:"inter",
  fontSize:15,
  color:"black",
},
h6:{
  fontFamily:"inter",
  fontSize:14,
  color:"#09759D",
  fontWeight:"bold",
  
},
h7:{
  color:"white",
  fontFamily:"inter",
  fontSize:17,
},
h8:{
  fontFamily:"inter",
  fontSize:15,
  color:"#080D50",
  fontWeight:"bold",
  marginBottom:"10px",
},
},
shape:{
    borderRadius:20
},
spacing:10,
overrides:{
  MuiButton:{
        root:{
            textTransform:"none",
            padding:"20px"
        },
       fullWidth:{
         maxWidth:"300px"
       } ,
    },
    MuiTextField: {
        root: {
          margin: "8px", //
        },
      },
},
props:{
    MuiButton:{
        disableRipple:true,
        variant:"contained"
    }
}
}
)
export const buttonStyles =(color)=> ({
    backgroundColor:color,
    color:"white",
    textTransform:"none",
    width:"auto",
  });