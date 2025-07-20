// components/bin/EditBinModal.tsx
import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Stack,
  FormControl,
  FormLabel,
  Input,
  DialogActions,
  Button,
  Backdrop,
  Fade
} from '@mui/material';

interface EditBinModalProps {
  open: boolean;
  onClose: () => void;
  formData: { id: number | null; name: string; branch: number };
  setFormData: React.Dispatch<React.SetStateAction<{ id: number | null; name: string; branch: number }>>;
  onSubmit: () => void;
  isLoading: boolean;
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

export const EditBinModal: React.FC<EditBinModalProps> = ({
  open,
  onClose,
  formData,
  setFormData,
  onSubmit,
  isLoading
}) => {
  return (
    <Modal
      aria-labelledby="spring-modal-title"
      aria-describedby="spring-modal-description"
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { TransitionComponent: Fade } }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Typography id="spring-modal-title" variant="h6" component="h2">
            Modifier la case
          </Typography>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <Stack spacing={3}>
              <FormControl>
                <FormLabel>Nom</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </FormControl>
            </Stack>
            <DialogActions>
              <Button onClick={onClose}>Annuler</Button>
              <Button onClick={onSubmit} disabled={isLoading}>
                Enregistrer
              </Button>
            </DialogActions>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
};
