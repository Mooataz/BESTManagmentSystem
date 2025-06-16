 import DynamicTable from '../../Componants/global/TableComponat'
 import { useNotification } from '../../Componants/NotificationContext'
import { FormLabel, Input, Stack } from '@mui/joy';
import * as React from "react";
import Table from '@mui/joy/Table';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
 import Divider from '@mui/joy/Divider';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DeleteForever from '@mui/icons-material/DeleteForever';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import Tooltip from '@mui/joy/Tooltip';
import AdjustIcon from '@mui/icons-material/Adjust';
import Add from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../Redux/store';
import { addLegislation, getLegislations } from '../../Redux/Actions/Administration/Legislation';
import type { FormOneInput } from '../../Redux/Types/administrationTypes';
import { useAppDispatch } from '../../Redux/hooks';
 const Legislation = () => {
    const dispatch = useAppDispatch();
    const {   legislation, loading, error } = useSelector((state: RootState) => state.legislation)
  
    React.useEffect(() => {
    dispatch(getLegislations());
  }, [dispatch]);
  console.log('legislation: ',legislation)
    return (
    <div>
      <Typography>Législation</Typography>
      <AjouteLow />
       <DynamicTable 
                    rows={legislation}
                     /* actions */  
                    columnLabels={{
                       
                      'name': 'Description',
                       
                    }}

                    columnsToShow={[ 
                      'name',
                       ]} />  
    </div>
  )
}

export default Legislation;


function AjouteLow( ) {
    const { notify } = useNotification();
    const dispatch = useDispatch<AppDispatch>();
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
const [formData, setFormData] = React.useState({  
    name:'',
})
const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await dispatch(addLegislation(formData));
 
      setOpen(false);
          notify("Ajoute avec succès !", "success");

    } catch (err) {
       
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "danger");
    } finally {
      setIsLoading(false);
    }
  };

  
     
  
     return (
        <React.Fragment>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', width:'60%', marginLeft:'20%'}}>
              <div style={{ marginLeft: '65%', marginBottom: '1%' }}>
                    <Button
                    variant="outlined"
                    color="neutral"
                    startDecorator={<Add />}
                     fullWidth  onClick={() => setOpen(true)}
                    >
                    Ajouter un nouvelle loi
                    </Button>
                </div>
            </Box>
            <Modal open={open} onClose={() => setOpen(false)} >
                <ModalDialog
                    aria-labelledby="nested-modal-title"
                    aria-describedby="nested-modal-description"
                    sx={(theme) => ({
                        [theme.breakpoints.only('xs')]: {
                            top: 'unset',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            borderRadius: 0,
                            transform: 'none',
                            //maxWidth: 'unset',
                            width: 900 
                        },
                    })}
                >
                    <Typography id="nested-modal-title" level="h2">
                        Ajouter un loi
                    </Typography>
                    <Typography id="nested-modal-description" textColor="text.tertiary">
                        <Stack spacing={2}>

                            <FormLabel>Description</FormLabel>
                            <Input variant="soft" sx={underlineInputStyles} value={formData.name} onChange={(e)=>setFormData({...formData,name:e.target.value})}/>
                            
                            
                        </Stack>
                    </Typography>
                    <Box
                        sx={{
                            mt: 1,
                            display: 'flex',
                            gap: 1,
                            flexDirection: { xs: 'column', sm: 'row-reverse' },
                        }}
                    >
                        <Button variant="solid" color="primary" onClick={handleSubmit } loading={isLoading}> {/*() => setOpen(false)*/}
                            Enregistrer
                        </Button>
                        <Button
                            variant="outlined"
                            color="neutral"
                            onClick={() => setOpen(false)}
                        >
                            Annuler
                        </Button>
                    </Box>
                    {error && <Typography color="danger">{error}</Typography>}
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
};
const underlineInputStyles = {
    '--Input-radius': '0px',
    borderBottom: '2px solid',
    borderColor: 'neutral.outlinedBorder',
    '&:hover': {
        borderColor: 'neutral.outlinedHoverBorder',
    },
    '&::before': {
        border: '1px solid var(--Input-focusedHighlight)',
        transform: 'scaleX(0)',
        left: 0,
        right: 0,
        bottom: '-2px',
        top: 'unset',
        transition: 'transform .15s cubic-bezier(0.1,0.9,0.2,1)',
        borderRadius: 0,
    },
    '&:focus-within::before': {
        transform: 'scaleX(1)',
    },
    width:'500px',
    
};