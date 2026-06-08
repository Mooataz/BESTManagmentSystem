import { API_BASE_URL } from '../../../services/api';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
 import Typography from '@mui/material/Typography';
import UpdateMarque from './UpdateMarque';
 


export default function CardMarque(item:any) {
       
  return (
    <div>
      <Card sx={{ display: 'flex' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5">
           {item.name} 
          </Typography>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ color: 'text.secondary' }}
          >
            {item.status}
          </Typography>
        </CardContent>
        <br/><br/>
      <UpdateMarque marque={item} />
      </Box>
        <CardMedia
        component="img"
        sx={{ width: 200 , height:90}}
        image={`${API_BASE_URL}/upload/brands/${item.logo}`}
        alt="Un marque"
      />  
    </Card>
    </div>
  )
}
