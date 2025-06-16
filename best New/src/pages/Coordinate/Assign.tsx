import React, { useState } from 'react'
 import type { RepairForm, RepairFormInput, TableAction } from '../../Redux/Types/repairTypes';
import type { RootState } from '../../Redux/store';
import { useSelector } from 'react-redux';
import { useNotification } from '../../Componants/NotificationContext';
import { useAppDispatch } from '../../Redux/hooks';
import { Box, Button, Typography } from '@mui/material';
import DynamicTable from '../../Componants/Global/TableComponat';
import { CustomAutocomplete } from '../../Componants/Global/CustomAutocomplete';
import type { User } from '../../Redux/Types/authenTypes';
import { AssignTech } from '../../Redux/Actions/Coordinate';
import { AssignRepair, getByBranchStep } from '../../Redux/Actions/Reception/repairAction';
import { addHistoryRepair } from '../../Redux/Actions/Reception/History';

export default function Assign() {
      const dispatch = useAppDispatch();
  const { notify } = useNotification();
   const userr = useSelector((state: RootState) => state.user);
  const repairs = useSelector((state: RootState) => state.repair.repairs)
  const [results, setResults] = useState<RepairForm[]>([]);
  const [techs, setTechs] = useState<User[]>([]);

  React.useEffect(() => {
    if (userr.branch?.id) {
      dispatch(getByBranchStep({ branch: userr.branch.id, step: 'On affectation' }))
        .then((resultAction) => {  if (getByBranchStep.fulfilled.match(resultAction)) {
        setResults(resultAction.payload);
      } else {
        notify(`Erreur lors du chargement : ${resultAction.payload}`, 'error')
      }
        })
     
    }
  }, [dispatch, userr.branch?.id])

const isAdmin = userr.role.includes('Administrateur');
React.useEffect(() => {
  if (userr.branch?.id) {
    dispatch(AssignTech({ branchId: userr.branch.id, admin: isAdmin }))
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
}, [dispatch, userr.branch?.id]);

  
const [selectedIds, setSelectedIds] = React.useState<number[] | number  >( );
 
  const handleSelectionChange = (ids: number[] | number  ) => {
  setSelectedIds(ids);
  
  };
 
const AssignToTechnicien = async (repairId: number, userId: number) => {
  try { 
      dispatch ( AssignRepair({ id: repairId, user: userId }) ) 
        .then ( () => {
          dispatch (
            addHistoryRepair({
                        date: new Date(),
                        step: 'Affecter',
                        user: { id: userr.id  || 0 },
                        repair: repairId
                      })

          ) .then( () => {
                dispatch ( getByBranchStep({ 
                                          branch: userr?.branch?.id || 0, 
                                          step: 'On affectation' }) ).then((resultAction) => {  if (getByBranchStep.fulfilled.match(resultAction)) {
                                                                      setResults(resultAction.payload); }} )
          });
                
        }) ;
     
       
        
     
  } catch (error) {
    notify(`Erreur lors de l\'assignation du technicien: ${error}`,'error');
     
  }
};

// 1. Définition des actions
const actions: TableAction[] = [
  {
    icon:  
      <Box sx={{ display: 'flex', gap: 1 }}>
        <CustomAutocomplete
          data={techs}
          displayFields={['name']}
          idField="id"
          multiple={false}
          label="Technicien"
          onChange={handleSelectionChange}
        />

        {/* Utilisation de row dans une fonction d'action */}
        <Button
            size="small"
            variant="outlined" >
            Affecter  
          </Button>
  
      </Box>
     ,
    // Fonction d'action qui sera appelée lors de l'usage
    onClick: (row :any) => {
       if (row) {
                try {
                  let userId: number | undefined;

                  if (Array.isArray(selectedIds) && selectedIds.length > 0) {
                    // Si c'est un tableau, on prend le premier élément
                    userId = selectedIds[0];
                  } else if (typeof selectedIds === 'number') {
                    // Si c'est déjà un nombre, on l'utilise directement
                    userId = selectedIds;
                  }
                  if (userId !== undefined) {
         
                     AssignToTechnicien(row.id, userId)
                   
                      
                    
                   } else {
                    notify(`Aucun technicien sélectionné`,'error')
        
                          }
                } catch (error) {
                  notify(`Erreur lors de l\'assignation  : ${error}`,'error');
                  
                }
              }
       
             
    }



  }
];

  return (
     <div style={{ padding: '20px' }}>
      <Typography sx={{ textAlign: 'left', fontWeight: 'bold', marginBottom: '3%' }} >List affectation</Typography   >

      <DynamicTable
        rows={results}

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

         actions = {actions}    

      />
    </div>
  )
}
