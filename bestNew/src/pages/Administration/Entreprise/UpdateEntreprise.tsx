import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import type { TransitionProps } from '@mui/material/transitions';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import type { Company } from '../../../Redux/Types/administrationTypes';
import { FormControl, FormLabel, Input, Stack } from '@mui/material';
import { useNotification } from '../../../Componants/NotificationContext';
import { useAppDispatch } from '../../../Redux/hooks';
import { getCompany, updateCompany } from '../../../Redux/Actions/Administration/Company';
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function UpdateEntreprise({ Company  }: { Company: Company;  }){
      const [open, setOpen] = React.useState(false);
const { notify } = useNotification();
  const dispatch = useAppDispatch();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [name, setName] = React.useState({ id: Company.id, name: Company.name, })
  const [headquarterslocation, setHeadquarterslocation] = React.useState({ id: Company.id, headquarterslocation: Company.headquarterslocation, })
  const [taxRegisterNumber, setTaxRegisterNumber] = React.useState({ id: Company.id, taxRegisterNumber: Company.taxRegisterNumber, })
  const [rib, setRib] = React.useState({ id: Company.id, rib: Company.rib, })
  const [bank, setBank] = React.useState({ id: Company.id, bank: Company.bank, })
  const [quantityAlertStock, setQuantityAlertStock] = React.useState({ id: Company.id, quantityAlertStock: Company.quantityAlertStock, })

  const handleSubmit = async (data: Partial<Company> & { id: number }) => {
  
  
    try {
       dispatch( updateCompany(data)) ;
       
      setOpen(false);
        dispatch(getCompany())
      notify("Mise à jour avec succès !", "success");

    } catch (err) {
       
     const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "error");

    }  
  };
  return (
    <div>
          <React.Fragment>
      <AutoFixHighIcon   onClick={handleClickOpen}  />
        
      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Modifier les donnèes de l\'entreprise"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            
<form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              setOpen(false);
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Nom</FormLabel>
                <div style={{ display: 'flex' }}>
                  <Input   sx={underlineInputStyles} value={name.name} onChange={(e) => setName({ ...name, name: e.target.value })} />
                  <Button   variant={'outlined'} color="neutral" style={{ width: '160px', marginLeft: '14%' }}
                    onClick={() => handleSubmit({ id: Company.id, name: name.name })} > Mettre à jour</Button>
                </div>
              </FormControl>
            <FormControl>
              <FormLabel>Adresse</FormLabel>
                <div style={{display:'flex'}}>
                  <Input   sx={underlineInputStyles} value={headquarterslocation.headquarterslocation} onChange={(e) => setHeadquarterslocation({ ...headquarterslocation,  headquarterslocation: e.target.value })} />
                   <Button   variant={'outlined'} color="neutral" style={{width:'160px',marginLeft:'14%'}}
                      onClick={() => handleSubmit({ id: Company.id, headquarterslocation: headquarterslocation.headquarterslocation })} > Mettre à jour</Button>
                 </div>
                                        
            </FormControl>
            <FormControl>
              <FormLabel>MF</FormLabel>
                <div style={{display:'flex'}}>
                  <Input   sx={underlineInputStyles} value={taxRegisterNumber.taxRegisterNumber} onChange={(e) => setTaxRegisterNumber({ ...taxRegisterNumber,  taxRegisterNumber: e.target.value })} />
                   <Button   variant={'outlined'} color="neutral" style={{width:'160px',marginLeft:'14%'}}
                      onClick={() => handleSubmit({ id: Company.id, taxRegisterNumber: taxRegisterNumber.taxRegisterNumber })} > Mettre à jour</Button>
                 </div>
                                        
            </FormControl>
            <FormControl>
              <FormLabel>RIB</FormLabel>
                <div style={{display:'flex'}}>
                  <Input   sx={underlineInputStyles}  type='number' value={rib.rib} onChange={(e) => setRib({ ...rib,  rib: Number(e.target.value) })} />
                   <Button   variant={'outlined'} color="neutral" style={{width:'160px',marginLeft:'14%'}}
                      onClick={() => handleSubmit({ id: Company.id, rib: rib.rib })} > Mettre à jour</Button>
                 </div>
                                        
            </FormControl>
            <FormControl>
              <FormLabel>Banque</FormLabel>
                <div style={{display:'flex'}}>
                  <Input   sx={underlineInputStyles} value={bank.bank} onChange={(e) => setBank({ ...bank,  bank: e.target.value })} />
                   <Button   variant={'outlined'} color="neutral" style={{width:'160px',marginLeft:'14%'}}
                      onClick={() => handleSubmit({ id: Company.id, bank: bank.bank })} > Mettre à jour</Button>
                 </div>
                                        
            </FormControl>
                        <FormControl>
              <FormLabel>Alert stock</FormLabel>
                <div style={{display:'flex'}}>
                  <Input   sx={underlineInputStyles}  type='number' value={quantityAlertStock.quantityAlertStock} onChange={(e) => setQuantityAlertStock({ ...quantityAlertStock,  quantityAlertStock: Number(e.target.value) })} />
                   <Button   variant={'outlined'} color="neutral" style={{width:'160px',marginLeft:'14%'}}
                      onClick={() => handleSubmit({ id: Company.id, quantityAlertStock: quantityAlertStock.quantityAlertStock })} > Mettre à jour</Button>
                 </div>
                                        
            </FormControl>
            </Stack>
          </form>

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Fermer</Button>
          
        </DialogActions>
      </Dialog>
    </React.Fragment>
    </div>
  )
}
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
  width: '500px',

};