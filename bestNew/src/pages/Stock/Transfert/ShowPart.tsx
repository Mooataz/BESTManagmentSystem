import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide, Stack } from "@mui/material";
import type { TransitionProps } from "@mui/material/transitions";
import React, { useState } from "react";
import { useAppDispatch } from "../../../Redux/hooks";
import { useNotification } from "../../../Componants/NotificationContext";
import type { getFormStock, TransfertPR } from "../../../Redux/Types/Stock";
import DynamicTable from "../../../Componants/Global/TableComponat";

interface UpdateProps {
    data?: TransfertPR;
    open: boolean;
    onClose: () => void;
}
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
export default function ShowPart({ data, open, onClose }: UpdateProps) {
  const [description, setDescription] = useState<TransfertPR>()
  React.useEffect(() => {
    if (data) {
      setDescription(data)
    }
  }, [data]);
  return (
    <Dialog
  open={open}
  slots={{ transition: Transition }}
  keepMounted
  onClose={onClose}
  aria-describedby="alert-dialog-slide-description"
  PaperProps={{
    sx: {
      width: '900px',
      maxWidth: '900px', // Important pour ne pas être limité par la valeur par défaut
    },
  }}
>
      <DialogTitle>{"Liste de transfert"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <DynamicTable
            rows={data?.stockPart ?? []}
            columnLabels={{
              'id': 'Code',
              'materialCode': 'Material Code',
              'partDescription': 'Pièce',
               'model': 'Modèle compatible',
              'serialnumber': 'Imei',
              'remark': 'Remarque',
              
            }}
            columnsToShow={[
              'id',
              'materialCode',
              'partDescription',
              'model',
              'serialnumber',
              'remark',
               
            ]}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}






