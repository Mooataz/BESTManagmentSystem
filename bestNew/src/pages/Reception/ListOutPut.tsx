import React, { useState } from 'react'
import { useAppDispatch } from '../../Redux/hooks';
import { useNotification } from '../../Componants/NotificationContext';
import { useSelector } from 'react-redux';
import type { RootState } from '../../Redux/store';
import { getByBranchStep } from '../../Redux/Actions/Reception/repairAction';
import type { RepairForm, TableAction } from '../../Redux/Types/repairTypes';
import { GetOutPutBranch } from '../../Redux/Actions/Reception/OutputRepairsActions';
import { Box, Typography } from '@mui/material';
import theme from '../../Theme/theme';
import DynamicTable from '../../Componants/Global/TableComponat';
import ShowDetails from './ShowDetails';
import { TbListDetails } from "react-icons/tb";
import ShowDetailsReturn from './ShowDetailsReturn';
export default function ListOutPut() {
    const dispatch = useAppDispatch();
    const { notify } = useNotification();
    const userr = useSelector((state: RootState) => state.auth.user);
    const [results, setResults] = useState<RepairForm[]>([]);
    const ListOut = useSelector((state: RootState) => state.OutputList.out)
    const getLastStep = (history: any[] = []) => {
        if (!Array.isArray(history) || history.length === 0) return '-';

        const sorted = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return sorted[0]?.step ?? '-';
    };

    React.useEffect(() => {

        if (!userr?.id || !userr?.branch) return;

        const branchId = typeof userr.branch === 'object' ? userr.branch.id : userr.branch;
        if (!branchId || isNaN(userr.id)) return;

   dispatch(GetOutPutBranch(branchId))
    .then((resultAction) => {
        if (GetOutPutBranch.fulfilled.match(resultAction)) {
            setResults(resultAction.payload);
        } else {
            const errorMessage = (resultAction.payload as { message?: string })?.message || 'Erreur inconnue';
            notify(`Erreur lors du chargement : ${errorMessage}`, 'error');
        }
    });



    }, [dispatch, userr, notify]);
    const [openDetails, setOpenDetails] = React.useState(false);
    const [row, setRow] = useState(0);
    const [open, setOpen] = React.useState(false);
     const [isLoading, setIsLoading] = useState(false);
    const handleCloseDetails = () => setOpenDetails(false);
   
  const handelOpenDetailes = (id: number) => {
    setRow(id);
    setOpenDetails(true);

  }
       const actions: TableAction[] = [
   
  {
    icon: <TbListDetails  style={{ color: theme.palette.primary.main  }} />,
    onClick: (row: any) => handelOpenDetailes(row.id)
  }]
    return (
        <Box>
            <Typography
                sx={{
                    textAlign: 'left',
                    fontWeight: 'bold',
                    marginBottom: '3%',
                    color: theme.palette.secondary.main
                }} >List des rècuperation</Typography   >
            <br />

            <DynamicTable
                rows={ListOut}

                columnLabels={{
                    'id': 'N°',
                    'customer.name': 'Rècuperer par',
                    'customer.phone': 'Téléphone',
                    'remark': 'Remarque',
                    'date': 'Sortie le',
                    'user.name': 'Sortie par'
                }}

                columnsToShow={['id',
                    'customer.name',
                    'customer.phone',
                    'remark',
                    'date',
                    'user.name'
                ]}
                actions={actions}
            />

            <ShowDetailsReturn
                    open={openDetails}
                    onClose={handleCloseDetails}
                    idOut={row}
                    isLoading={isLoading}
                  />
        </Box>
    )
}
