import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import type { TransitionProps } from '@mui/material/transitions';
import { useAppDispatch } from '../../../../Redux/hooks';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../Redux/store';
import { getMarques } from '../../../../Redux/Actions/Administration/MarquesActions';
import { getModelsAuthorised } from '../../../../Redux/Actions/ModelAndAccessory/Models';
import { CustomAutocomplete } from '../../../../Componants/Global/CustomAutocomplete';
import { Box, Card, Stack, Typography } from '@mui/material';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { useNotification } from '../../../../Componants/NotificationContext';
import type { Model } from '../../../../Redux/Types/repairTypes';
import theme from '../../../../Theme/theme';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function SelectModelByPicture({ onSelectModel }: { onSelectModel: (id: number) => void }) {
     const dispatch = useAppDispatch();
     const {notify} = useNotification();

     const models = useSelector( (state:RootState) => state.models.models);
     const marques = useSelector ( (state:RootState) => state.Marques.Marque);

  const handleClick = (id: number) => {
    onSelectModel(id);
  };

     React.useEffect( () => {
        dispatch(getMarques());
        dispatch(getModelsAuthorised());
     }, [dispatch]);

    const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

 

    const handleSelectionChange = (ids:    number  ) => {
    setSelectedIds(ids);
    
    };
 const handleNext = () => {
  if (selectModel.length === 0) return;
  setCurrentIndex((prevIndex) => (prevIndex + 1) % selectModel.length);
};

const handlePrev = () => {
  if (selectModel.length === 0) return;
  setCurrentIndex((prevIndex) =>
    prevIndex === 0 ? selectModel.length - 1 : prevIndex - 1
  );
};

const [valueMarque, setSelectedIds] = React.useState<number | null>(null);
const [currentIndex, setCurrentIndex] = React.useState<number>(0);
const [selectModel, setselectModel] = React.useState<Model[]>([]);

React.useEffect(() => {
  if (valueMarque !== null) {
    const filtered = models.filter((m) => m.brand.id === valueMarque);
    setselectModel(filtered);
    setCurrentIndex(0); // reset to the first item
  } else {
    setselectModel([]);
    setCurrentIndex(0);
  }
}, [valueMarque, models]);


 
  const selectedModel = selectModel[currentIndex];
  return (
    <div>
          <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen} sx={{width:'400px'}}>
        Modèle par image
      </Button>
      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Select par image"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              setOpen(false);
                if (selectedModel) {
                        handleClick(selectedModel.id || 0); 
                      notify(`Modèle sélectionné: ${selectedModel.name}`,'success');
                    }
            }}
          >
            <Stack spacing={2}>
              <Card>


    <Card   sx={{ width: 450, bgcolor: 'initial', p: 0 , padding:'10px'}}>
      <Box sx={{ position: 'relative' }}>
         
          <figure>
            {selectedModel && (
                          <img
                            style={{
                              width:'400px',
                              height:'400px',
                              objectFit: 'cover', // ou 'contain' selon préférence
                              borderRadius: '8px'
                            }}
                            src={`http://localhost:3000/upload/models/${selectedModel.picture}`}
                            loading="lazy"
                            alt={selectedModel.name ?? 'Modèle'}
                          />
                        )}
          </figure>
       
         
      </Box>
  
        <Typography sx={{ fontSize: 'sm', fontWeight: 'md' }}>
          {selectedModel?.brand.name} _ {selectedModel?.name ?? 'Selectionner un marque'}
        </Typography><br/>
        <CustomAutocomplete
                      data={marques}
                      displayFields={['name']}
                      idField="id"
                      multiple={false}
                      label="Marques"
                      //onChange={handleSelectionChange}
                      onChange={(value) => handleSelectionChange(value)}
                    /> 
  
    </Card>
                   <br/>   
                <div style={{display:'flex' , justifyContent:'space-around'}}>
                  <Button variant="outlined"  
                      onClick={handlePrev} >
                        <KeyboardDoubleArrowLeftIcon />
                      </Button>
                      <Button variant="outlined"  
                       onClick={handleNext} >
                        <KeyboardDoubleArrowRightIcon />
                      </Button>
                </div>
              </Card>

              <Button type="submit" variant='outlined' sx={{borderColor:theme.palette.primary.main}} >Select</Button>
            </Stack>
          </form>
            
            
          </DialogContentText>
        </DialogContent>
    
      </Dialog>
    </React.Fragment>
    </div>
  )
}
