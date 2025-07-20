import React, { useEffect, useState } from 'react'
import ADDAutreFrais from './ADDAutreFrais'
import { Typography } from '@mui/material'
import DynamicTable from '../../../Componants/Global/TableComponat'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../Redux/store'
import { GetAllFrais } from '../../../Redux/Actions/Administration/AutresFraisActions'
import { useAppDispatch } from '../../../Redux/hooks'
import { useNotification } from '../../../Componants/NotificationContext'
import theme from '../../../Theme/theme'
import type { TableAction } from '../../../Redux/Types/repairTypes'
import ModeIcon from '@mui/icons-material/Mode';
import UpdateAutresFrais from './UpdateAutresFrais'
 
export default function ListFrais() {
    const frais = useSelector((state: RootState) => state.OtherCost.autresFrais);
    const dispatch = useAppDispatch();
    const { notify } = useNotification();
    const [selectedRow, setSelectedRow] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);
    const handelOpenEdit = (row: any) => {
        setSelectedRow(row);
        setOpenEdit(true);
    };
    const handleCloseEdit = () => {
          setOpenEdit(false);
      };
    useEffect(() => {
        dispatch(GetAllFrais())
    }, [dispatch])


    const actions: TableAction[] = [{
          icon: <ModeIcon style={{ color: theme.palette.primary.main }} /> ,
          onClick: (row: any) =>   handelOpenEdit(row)  
      } ]
    return (
        <div>
            <Typography sx={{ textAlign: 'left', fontWeight: 'bold', marginBottom: '3%', color: theme.palette.secondary.main, width: '200px' }}>
                Liste des frais
            </Typography>
            <ADDAutreFrais />
            <DynamicTable rows={frais}

                columnLabels={{
                    'id': 'Code',
                    'name': 'Nom',
                    'price': 'Prix',
                    'status': 'Status'
                }}

                columnsToShow={[
                    'id',
                    'name',
                    'price',
                    'status'
                ]}

                  actions={actions}   />


            {selectedRow && (
                <UpdateAutresFrais
                    frais={selectedRow}
                    open={openEdit}
                    onClose={handleCloseEdit}
                />
            )}

        </div>
    )
}
