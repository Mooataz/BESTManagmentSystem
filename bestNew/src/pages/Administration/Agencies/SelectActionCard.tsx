import React from "react";
import type { Agency } from "../../../Redux/Types/Stock";
import { Box, Card, CardActionArea, CardContent, Divider, Typography } from "@mui/material";
import { UpdateAgence } from "./UpdateAgence";
import theme from "../../../Theme/theme";



type Props = {
  branches: Agency[];
};

export function SelectActionCard({branches}:Props ) {
  const [selectedCard, setSelectedCard] = React.useState(0);
  return (
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 2,
      }}
    >
      {branches.map((card, index) => (
        <Card sx={{margin:'30px'}}>
          <CardActionArea 
            onClick={() => setSelectedCard(index)}
            data-active={selectedCard === index ? '' : undefined}
            sx={{
               width:'100%', // 3 éléments par ligne avec gap
                    boxSizing: 'border-box',
              
            }}
          >
            <CardContent sx={{ height: '100%' }} >
              <Typography variant="h5" component="div">
                {card.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {card.location}
              </Typography>
              <Typography> {card.phone} </Typography>
              <Typography> {card.email} </Typography>
               <br/> <Divider sx={{borderColor: theme.palette.secondary.main}}/> <br/>
          <UpdateAgence agencie={card}/>
            </CardContent>
            
          </CardActionArea>
         
        </Card>
      ))}
    </Box>
  );
}