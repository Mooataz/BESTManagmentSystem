import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material'
import React, { useState } from 'react'
import type { Model } from '../../../Redux/Types/repairTypes'
import { BiShowAlt } from "react-icons/bi";
import ShowPart from './ShowPart';
import UpdateModele from './UpdateModele';

export default function CardModel(item: Model) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const handelOpenEdit = (row: any) => {
    setSelectedRow(row);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };
  return (
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
            {typeof item.brand === 'object' && !Array.isArray(item.brand)
              ? item.brand.name
              : Array.isArray(item.brand)
                ? item.brand.join(', ')
                : `ID: ${item.brand}`}
          </Typography>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ color: 'text.secondary' }}
          >
             


            {typeof item.typeModel === 'object' && !Array.isArray(item.typeModel)
              ? item.typeModel.description
              : Array.isArray(item.typeModel)
                ? item.typeModel.join(', ')
                : `ID: ${item.typeModel}`}
          </Typography>
          <Typography
            variant="subtitle2"
            component="div"
            sx={{ color: 'text.secondary' }}
          >
            <ShowPart itemModel={item} />
            <UpdateModele model={item} />
          </Typography>
        </CardContent>
        <br /><br />
        
      </Box>
      <CardMedia
        component="img"
        sx={{ width: 200, height: 300 }}
        image={`http://localhost:3000/upload/models/${item.picture}`}
        alt="Un marque"
      />
    </Card>
  )
}
