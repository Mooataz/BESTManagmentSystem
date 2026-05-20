import React, { useState } from 'react'
import { useAppDispatch } from '../../Redux/hooks';
import { useNotification } from '../../Componants/NotificationContext';
import { useSelector } from 'react-redux';
import type { RootState } from '../../Redux/store';
import type { RepairForm, TableAction } from '../../Redux/Types/repairTypes';
import type { User } from '../../Redux/Types/authenTypes';
import { AssignRepair, getByBranchStep } from '../../Redux/Actions/Reception/repairAction';
import { AssignTech } from '../../Redux/Actions/Coordinate';
import { addHistoryRepair } from '../../Redux/Actions/Reception/History';
import { Button, Typography } from '@mui/material';
import DynamicTable from '../../Componants/Global/TableComponat';
import { CustomAutocomplete } from '../../Componants/Global/CustomAutocomplete';
import theme from '../../Theme/theme';

export default function DeleteAssign() {
      const dispatch = useAppDispatch();
    const { notify } = useNotification();
    const userr = useSelector((state: RootState) => state.auth.user);
    const repairs = useSelector((state: RootState) => state.repair.repairs)
    const [results, setResults] = useState<RepairForm[]>([]);
    const [techs, setTechs] = useState<User[]>([]);
    if (!userr?.id || !userr?.branch) return;
  const branchId = typeof userr.branch === 'object' ? userr.branch.id : userr.branch;
    if (!branchId || isNaN(userr.id)) return;
    React.useEffect(() => {
      if (branchId) {
        dispatch(getByBranchStep({ branch: branchId, step: 'On réparation' }))
          .then((resultAction) => {
            if (getByBranchStep.fulfilled.match(resultAction)) {
              setResults(resultAction.payload);
            } else {
              notify(`Erreur lors du chargement : ${resultAction.payload}`, 'error')
            }
          })
  
      }
    }, [dispatch, branchId])
        const isAdmin = userr.role.includes('Administrateur');
        React.useEffect(() => {
          if (branchId) {
            dispatch(AssignTech({ branchId: branchId, admin: isAdmin }))
              .then((resultAction) => {
                if (getByBranchStep.fulfilled.match(resultAction)) {
                  setTechs(resultAction.payload); // Les données sont valides, donc on les utilise
                } else {
                  // Vérifier si resultAction.payload contient des utilisateurs ou des données valides
                  if (Array.isArray(resultAction.payload) && resultAction.payload.length > 0) {
                    // Si c'est un tableau d'utilisateurs, afficher un message approprié
                    setTechs(resultAction.payload);
                  } else {
                    // Sinon, c'est probablement une erreur
                    const errorMessage =
                      typeof resultAction.payload === 'object'
                        ? JSON.stringify(resultAction.payload)  // Convertir l'objet en chaîne
                        : resultAction.payload;  // Si ce n'est pas un objet, utilisez la valeur telle quelle
                    notify(`Erreur lors du chargement : ${errorMessage}`, 'error');
                  }
                }
      
              })
              .catch((error) => {
                // Gérer l'erreur dans le cas où la promesse échoue
                notify(`Erreur lors du chargement : ${error.message}`, 'error');
      
              });
          }
        }, [dispatch, branchId]);
            const AssignToTechnicien = async (repairId: number) => {
              try {
                dispatch(AssignRepair({ id: repairId, user: 0 }))
                  .then(() => {
                    dispatch(
                      addHistoryRepair({
                        date: new Date(),
                        step: 'On affectation',
                        user: { id: userr.id || 0 },
                        repair: repairId
                      })
          
                    ).then(() => {
                      dispatch(getByBranchStep({
                        branch: branchId || 0,
                        step: 'On réparation'
                      })).then((resultAction) => {
                        if (getByBranchStep.fulfilled.match(resultAction)) {
                          setResults(resultAction.payload);
                        }
                      })
                    });
          
                  });
          
              } catch (error) {
                notify(`Erreur lors de l\'assignation du technicien: ${error}`, 'error');
          
              }
            };

            const [clickedRowId, setClickedRowId] = React.useState<number | undefined>(undefined);
  const [selectedIds, setSelectedIds] = React.useState<number>()

 
  const actions: TableAction[] = [
    {
      icon: (
        <Button size="small" variant="outlined">
          Annuler
        </Button>
      ),
      onClick: async (row: any) => {
        let userId: number | undefined = selectedIds;




       
          setClickedRowId(row.id);
          await new Promise((res) => setTimeout(res, 1000));
          AssignToTechnicien(row.id);
          setClickedRowId(undefined);
        
      },
    },
  ];
  return (
       <div  style={{ padding: '20px' }}>
            <Typography sx={{ textAlign: 'left', 
              fontWeight: 'bold', 
              marginBottom: '3%', 
              color: theme.palette.secondary.main, 
              width: '200px' }} >List des réparations en cours</Typography   >
     
      <DynamicTable
        rows={results}
        clickedRowId={clickedRowId}
        columnLabels={{
          'id': 'Reparation',
          'customer.name': 'Nom client',
          'customer.phone': 'Téléphone',
          'device.id': 'Appareille n°',
          'device.serialenumber': 'Imei',
          'device.model.brand.name': 'Marque',
          'device.model.name': 'Modéle',
          'deviceStateReceive': 'État appareille'
        }}

        columnsToShow={['id',
          'customer.name',
          'customer.phone',
          'device.id',
          'device.serialenumber',
          'device.model.brand.name',
          'device.model.name',
          'deviceStateReceive']}

        actions={actions}

      />
    </div>
  )
}
