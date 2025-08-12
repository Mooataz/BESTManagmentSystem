import React, { useEffect, useState } from 'react'
import { getAllPartPrice } from '../../../Redux/Actions/stock/PartPriceActions'
import { useAppDispatch } from '../../../Redux/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import DynamicTable from '../../../Componants/Global/TableComponat';
import AddPartPrice from './AddPartPrice';
import { Typography } from '@mui/material';
import theme from '../../../Theme/theme';
import UpdatePartPrice from './UpdatePartPrice';
import type { TableAction } from '../../../Redux/Types/repairTypes';
import EditIcon from '@mui/icons-material/Edit';

export default function ListPartPrice() {
const dispatch = useAppDispatch();
const partsPrice = useSelector((state:RootState) => state.PartPrice.PartPrice)
    useEffect(() => {
        dispatch(getAllPartPrice())
    }, [dispatch])

      const [selectedRow, setSelectedRow] = useState(null);
        const [openEdit, setOpenEdit] = useState(false);
        const handelOpenEdit = (row: any) => {
            setSelectedRow(row);
            setOpenEdit(true);
        };
        const handleCloseEdit = () => {
            setOpenEdit(false);
        };
         const actions: TableAction[] = [{
                icon: <EditIcon style={{ color: theme.palette.primary.main }} />,
                onClick: (row: any) => handelOpenEdit(row)
            }]
  return (
    <div>
      
      <Typography sx={{
                textAlign: 'left',
                color: theme.palette.secondary.main,
                width: '200px',
                fontWeight: 'bold',
                marginBottom: '3%'
            }} >List des prix</Typography   >
<AddPartPrice />
       <DynamicTable
                rows={partsPrice}
                columnLabels={{
                    'id': 'Code',
                    'model.name': 'Modèle',
                    'allPart.description': 'Pièce',
                    'price': 'Prix',
                    'levelRepair.name': 'Niveau rèparation',
                    'levelRepair.price':'Frais réparation'
                    
                }}
                columnsToShow={[
                    'id',
                    'model.name',
                    'allPart.description',
                    'price',
                    'levelRepair.name',
                    'levelRepair.price',
                    
                ]}
                actions={actions} 
            />

             {selectedRow && (
                            <UpdatePartPrice
                                partPrice={selectedRow}
                                open={openEdit}
                                onClose={handleCloseEdit}
                            />
                        )}
    </div>
  )
}
