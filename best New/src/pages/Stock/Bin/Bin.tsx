import React, { useState } from 'react'
import { Box, Fade, FormControl, FormLabel, Input, ListItemButton, MenuItem, Stack, TextField, Toolbar } from '@mui/material';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import { useNotification } from '../../../Componants/NotificationContext';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import type { Agency, Bin } from '../../../Redux/Types/Stock';
import {   getBin, updateBin } from '../../../Redux/Actions/stock/Bin';
import Backdrop from '@mui/material/Backdrop';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DynamicTable from '../../../Componants/Global/TableComponat';
import type { TableAction } from '../../../Redux/Types/repairTypes';
import { useAppDispatch } from '../../../Redux/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../Redux/store';
import { AddBin } from './AddBin';
import { EditBinModal } from './EditBinModal';


export function Bin() {
    const dispatch = useAppDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const userr = useSelector((state: RootState) => state.user);
    const bin = useSelector((state: RootState) => state.bin.bin)
    const [open, setOpen] = React.useState(false);
    const { notify } = useNotification();
    const [formData, setFormData] = useState<{ id: number | null, name: string, branch: number }>({ id: null, name: '', branch:0 });
    const [isLoading, setIsLoading] = useState(false);

 
    
 React.useEffect( () => {
    if ( userr.branch?.id) {
        dispatch(getBin(userr.branch.id) )
        
          
    }
 }, [userr.branch?.id, dispatch])

 

const handleOpenEdit = (row: Bin) => {
        setFormData({ id: row.id || 0, name: row.name , branch:userr.branch?.id || 0});
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleSubmit = async () => {
        if (formData.id == null) return;
        setIsLoading(true);
        try {
            const result = await dispatch(updateBin({ id: formData.id, name: formData.name, branch:userr.branch?.id || 0 }));
            if (updateBin.fulfilled.match(result)) {
                notify('Mis à jour avec succès', 'success');
                setOpen(false);
                if (userr.branch?.id) {
                    await dispatch(getBin(userr.branch.id));
                    }
            } else {
                notify(result.payload as string || 'Erreur lors de la mise à jour', 'error');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "error");
        } finally {
            setIsLoading(false);
        }
    };



const actions: TableAction[] = [
    {
        icon: <EditIcon style={{ color: '#1A9BC3' }} />,
        onClick: (row: Record<string, any>) => handleOpenEdit(row as Bin)
    }
];

    
    return (
        <div  style={{ padding: '20px' }}>
         
   
            <Typography  sx={{textAlign:'left' , fontWeight:'bold', marginBottom:'3%'}} >List des cases</Typography   >
            <AddBin /> <br/>

            <DynamicTable
                rows={bin}
                actions={actions}
                columnLabels={{
                    'id': 'Code',
                    'name': 'Nom case',
                    'type': 'Type',

                }}

                columnsToShow={['id',
                    'name',
                    'type',
                ]}

            />
            <EditBinModal
                open={open}
                onClose={handleClose}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                />

 

        </div>
    )
}



//--------------------------------------------------------------------------------
 
