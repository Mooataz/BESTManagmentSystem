import { useNotification } from "../Componants/NotificationContext";
import { FormLabel, Input, Stack } from '@mui/joy';
import * as React from "react";
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import IconButton from '@mui/joy/IconButton';
import Add from '@mui/icons-material/Add';
import { addMarque, getMarque, updateMarque } from "../../api/administration/Marque";
import FormControl from '@mui/joy/FormControl';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import { MdOutlineModeEditOutline } from "react-icons/md";
import Radio  from '@mui/joy/Radio';
 
interface Marque {

  id: number;
  name: string;
  logo: string;
  status: string;

}
 
export function Marques() {
  const [marques, setMarques] = React.useState<Marque[]>([])
const refreshMarques = () => {
  getMarque().then((data) => setMarques(data));
};

  React.useEffect(() => {
    getMarque()
      .then((data) => { setMarques(data) })
  })
  return (
    <div>
      <AjouteMarque />


      
         
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2, // espace entre les cartes
             
            margin: '0 auto',
          }}
        >
          {marques.map((item) => (
            <Box
              key={item.id}
              sx={{
                flex: '1 1 calc(33.333% - 16px)', // 3 éléments par ligne avec gap
                boxSizing: 'border-box',
              }}
            >
              <ContainerResponsive marque={item} onUpdate={refreshMarques}/>
            </Box>
          ))}
        </Box>

       
    </div>
  )
}

function AjouteMarque() {
  const { notify } = useNotification();

  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    name: '',
    logo: null as File | null,
    status: ''
  })
  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("status", formData.status);
      if (formData.logo) {
        data.append("logo", formData.logo); // ce nom est crucial
      }

      await addMarque(data); // OK

      setOpen(false);
      notify("Ajouter avec succès !", "success");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      notify(errorMessage, "danger");
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    setFormData({ ...formData, status: event.target.value })
  }
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', width: '60%', marginLeft: '20%' }}>
        <div style={{ marginLeft: '65%', marginBottom: '1%' }}>
          <Button
            variant="outlined"
            color="neutral"
            startDecorator={<Add />}
            fullWidth onClick={() => setOpen(true)}
          >
            Ajouter une marque
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
            Ajouter une marque
          </Typography>
          <Typography id="nested-modal-description" textColor="text.tertiary">
            <Stack spacing={2}>

              <FormLabel>Nom</FormLabel>
              <Input variant="soft" sx={underlineInputStyles} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

              <FormLabel>Logo</FormLabel>
              <Input variant="soft" sx={underlineInputStyles} type='file'
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setFormData({ ...formData, logo: file });
                }} />

              <FormLabel>Etat</FormLabel>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Radio
                  color="success"
                  checked={formData.status === 'Autoriser'}
                  onChange={handleChange}
                  value="Autoriser"
                  name="radio-buttons"
                  slotProps={{ input: { 'aria-label': 'Autoriser' } }}
                />Autoriser
                <Radio
                  color="danger"
                  checked={formData.status === 'Bloqué'}
                  onChange={handleChange}
                  value="Bloqué"
                  name="radio-buttons"
                  slotProps={{ input: { 'aria-label': 'Bloqué' } }}
                />Bloqué

              </Box>
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
            <Button variant="solid" color="primary" onClick={handleSubmit} loading={isLoading}> {/*() => setOpen(false)*/}
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
 
export function ContainerResponsive({ marque, onUpdate }: {marque:Marque; onUpdate: () => void}) {
  return (
    <Box sx={{ minHeight: 350 }}>
      <Card
        variant="outlined"
        sx={(theme) => ({
          width: 300,
          gridColumn: 'span 2',
          flexDirection: 'row',
          flexWrap: 'wrap',
          resize: 'horizontal',
          overflow: 'hidden',
          gap: 'clamp(0px, (100% - 360px + 32px) * 999, 16px)',
          transition: 'transform 0.3s, border 0.3s',
          '&:hover': {
            borderColor: theme.vars.palette.primary.outlinedHoverBorder,
            transform: 'translateY(-2px)',
          },
          '& > *': { minWidth: 'clamp(0px, (360px - 100%) * 999,100%)' },
        })}
      >

        <Box
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 200 }}
        >
          <Box sx={{ display: 'flex' }}>
            <div>
              <Typography level="title-lg">

                {marque.name}

              </Typography>
            </div>
            <IconButton
              size="sm"
              variant="plain"
              color="neutral"
              sx={{ ml: 'auto', alignSelf: 'flex-start' }}
            >

            </IconButton>
          </Box>
          <AspectRatio
            variant="soft"
            sx={{
              '--AspectRatio-paddingBottom':
                'clamp(0px, (100% - 200px) * 999, 200px)',
              pointerEvents: 'none',
            }}
          >
            <img
             
              alt=""
              src={  `http://localhost:3000/upload/brands/${marque.logo}`  }
               
            />
          </AspectRatio>
          <Box sx={{ display: 'flex', gap: 1.5, mt: 'auto' }}>

            <div>
              {marque.status === 'Autoriser' ? (
                <Button size="md" variant="outlined" color="success">
                  {marque.status}
                </Button>
              ) : (
                <Button size="md" variant="outlined" color="danger">
                  {marque.status}
                </Button>
              )}
            </div>
            <EditMarque marque={marque} onMarqueUpdate={onUpdate}/>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}

function EditMarque({ marque, onMarqueUpdate }: { marque: Marque; onMarqueUpdate: () => void }) {

  const [open, setOpen] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { notify } = useNotification();

  const [name, setName] = React.useState({ id: marque.id,name: marque.name});
  const [logo, setLogo] = React.useState({ id: marque.id,logo: marque.logo});
  const [status, setStatus] = React.useState({ id: marque.id,status: marque.status});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus({ ...status, status: event.target.value })
  }

  const handleSubmit = async (data: Partial<Marque> & { id: number }) => {
    setIsLoading(true);
    setError(null);

    try {
      await updateMarque(data);
      setOpen(false);
      onMarqueUpdate();
      notify("Mise à jour avec succès !", "success");

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
            notify(errorMessage, "danger");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <React.Fragment>
        <Button
          variant="outlined"
          color="neutral"
          /* startDecorator={} */
          onClick={() => setOpen(true)}
        ><MdOutlineModeEditOutline /></Button>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog>
            <DialogTitle>Modifications</DialogTitle>
            <DialogContent>Modifier les points nécessaire </DialogContent>
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
                    <Input variant="soft" sx={underlineInputStyles} value={name.name} onChange={(e) => setName({ ...name, name: e.target.value })} />
                    <Button size="md" variant={'outlined'} color="neutral" style={{ width: '160px', marginLeft: '14%' }}
                      onClick={() => handleSubmit({ id: marque.id, name: name.name })} > Mettre à jour</Button>
                  </div>

                </FormControl>

                <FormControl>
                  <FormLabel>Logo</FormLabel>
                  <div style={{ display: 'flex' }}>
                    <Input variant="soft"  sx={underlineInputStyles} type='file'   onChange={(e) => setLogo({ ...logo, logo:e.target.value })} />
                    <Button size="md" variant={'outlined'} color="neutral" style={{ width: '160px', marginLeft: '14%' }}
                      onClick={() => handleSubmit({ id: marque.id, logo: logo.logo })}> Mettre à jour</Button>
                  </div>
                </FormControl>

                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <div style={{ display: 'flex' }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Radio
                        color="success"
                        checked={status.status === 'Autoriser'}
                        onChange={handleChange}
                        value="Autoriser"
                        name="radio-buttons"
                        slotProps={{ input: { 'aria-label': 'Autoriser' } }}
                      />Autoriser
                      <Radio
                        color="danger"
                        checked={status.status === 'Bloqué'}
                        onChange={handleChange}
                        value="Bloqué"
                        name="radio-buttons"
                        slotProps={{ input: { 'aria-label': 'Bloqué' } }}
                      />Bloqué

                    </Box>
                    <Button size="md" variant={'outlined'} color="neutral" style={{ width: '160px', marginLeft: '14%' }}
                      onClick={() => handleSubmit({ id: marque.id, status: status.status })}> Mettre à jour</Button>
                  </div>
                </FormControl>



              </Stack>
            </form>
          </ModalDialog>
        </Modal>
      </React.Fragment>
    </div>
  )
}
