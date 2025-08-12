import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import type { RootState } from '../../Redux/store';
import { useAppDispatch } from '../../Redux/hooks';
import { getByUserStep, getOneRepair, UpdatePartFileRepair } from '../../Redux/Actions/Reception/repairAction';
import { Box, Button, Card, Divider, IconButton, Input, MenuItem, Select, Table, TableCell, TableRow, type SelectChangeEvent } from '@mui/material';
import ShowHeadRepair from './ShowHeadRepair';
import { CustomAutocomplete } from '../../Componants/Global/CustomAutocomplete';
import { getAllExpertiseRaisons, GetOneRaison } from '../../Redux/Actions/Administration/RaisonsExpertiseActions';
import type { Device, Model, RepairForm, TypeModel, TypeUnique } from '../../Redux/Types/repairTypes';
import { CustomCheckboxSelector } from '../../Componants/Global/CustomCheckboxSelector';
import { useNotification } from '../../Componants/NotificationContext';
import { getOnePart } from '../../Redux/Actions/Administration/ListAllPart';
import theme from '../../Theme/theme';
import { addHistoryRepair } from '../../Redux/Actions/Reception/History';

export default function RepairedRepair() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { notify } = useNotification();
  const navigate = useNavigate()
  const userr = useSelector((state:RootState) => state.auth.user)
  const oneRepair = useSelector((state: RootState) => state.repair.oneRepair);
  const expertiseRaison = useSelector((state: RootState) => state.expertiseReasons);
  const NotesClient = useSelector((state: RootState) => state.NotesCustomer.notesCustomer);
  const repairActions = useSelector((state: RootState) => state.RepairAction.repairAction);
  function isModelObject(model: number | Model): model is Model {
    return typeof model === 'object' && model !== null && 'allpart' in model;
  }

  let BespartsNeed: TypeModel[] = [];

  const deviceObj = oneRepair?.device as Device;

  if (deviceObj?.model && isModelObject(deviceObj.model)) {
    const allpart = deviceObj.model.allpart ?? [];

    // Vérifie si chaque élément est bien un objet (type TypeModel)
    if (Array.isArray(allpart) && allpart.every(p => typeof p === 'object')) {
      BespartsNeed = allpart as TypeModel[];
    }
  }


  useEffect(() => {
    dispatch(getAllExpertiseRaisons())
  }, [dispatch])

  React.useEffect(() => {
    if (id) {
      dispatch(getOneRepair(Number(id)));
    }
  }, [dispatch, id]);

  const [formRepair, setFormRepair] = useState<RepairForm>()
  useEffect(() => {
    if (oneRepair) {
      let parsedPartsNeed: number[] = [];

      const partsNeedRaw = oneRepair.partsNeed as unknown;

      if (typeof partsNeedRaw === 'string') {
        parsedPartsNeed = partsNeedRaw
          .split(',')
          .map((id) => parseInt(id.trim(), 10))
          .filter((id) => !isNaN(id));
      } else if (Array.isArray(partsNeedRaw)) {
        parsedPartsNeed = partsNeedRaw;
      }

      setFormRepair((prev) => ({
        ...(prev ?? {}),
        id: oneRepair.id,
        warrenty: oneRepair.warrenty,
        expertiseReason: oneRepair.expertiseReason,
        notesCustomer: oneRepair.notesCustomer,
        repairAction: oneRepair.repairAction,
        files: oneRepair.files,
        partsNeed: parsedPartsNeed,
        remark: oneRepair.remark,
        customerRequest: oneRepair.customerRequest,
      }));
    }
  }, [oneRepair]);


  const handleChange = (event: SelectChangeEvent) => {
    setFormRepair((prev) => ({
      ...prev!,
      warrenty: event.target.value === "true",
    }));
  };
  const SelectExpertise = (ids: number[]) => {

    setFormRepair((prev) => ({
      ...prev!,
      expertiseReason: ids,
    }));
  };
  const SelectNotes = (ids: number[]) => {

    setFormRepair((prev) => ({
      ...prev!,
      notesCustomer: ids,
    }));
  };
  const SelectAction = (ids: number) => {

    setFormRepair((prev) => ({
      ...prev!,
      repairAction: [ids],
    }));
  };

  interface TypeModel {
    id?: number;
    description: string;
  }
   


  const handleSave = async () => {
       if (!formRepair) {
    notify('Formulaire invalide ou vide', 'error');
    return;
  }

  const formData = new FormData();

  // Handle files - filter out non-File objects
  if (formRepair.files) {
    formRepair.files.forEach(file => {
      if (file instanceof File) {
        formData.append('files', file);
      }
    });
  }

  // Handle other fields
  const fieldsToExclude = ['files', 'id'];
  Object.entries(formRepair).forEach(([key, value]) => {
    if (!fieldsToExclude.includes(key) && value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        // Handle array fields like partsNeed
        formData.append(key, JSON.stringify(value));
      } else if (typeof value === 'object') {
        // Handle object fields
        formData.append(key, JSON.stringify(value));
      } else {
        // Handle primitive values
        formData.append(key, value.toString());
      }
    }
  });

  // Always include ID
  if (formRepair.id) {
    formData.append('id', formRepair.id.toString());
  }

  
  const result = await dispatch(UpdatePartFileRepair(formData));

    // Ajouter les autres champs du formulaire (à adapter selon tes champs)
    Object.entries(formRepair).forEach(([key, value]) => {
      if (key !== 'files' && value !== undefined && value !== null) {
        // Si value est un objet ou un tableau, stringify
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    // Appel dispatch
    //const result = await dispatch(UpdatePartFileRepair(formData));

    if (UpdatePartFileRepair.fulfilled.match(result)) {
      if (formRepair.id) {
        dispatch(getOneRepair(Number(formRepair.id)));
      }
      notify('Enregistré avec succès', 'success');
    } else {
      notify(result.payload as string || 'Erreur lors de l’ajout', 'error');
    }
  };

  const [loadedParts, setLoadedParts] = useState<{ [key: number]: TypeModel | undefined }>({});
  useEffect(() => {
    const loadParts = async () => {
      if (oneRepair?.partsNeed && oneRepair.partsNeed.length > 0) {
        const results: { [key: number]: TypeModel | undefined } = {};

        for (const id of oneRepair.partsNeed) {
          try {
            const res = await dispatch(getOnePart(Number(id))).unwrap(); // ou .then(r => r.payload)
            results[Number(id)] = res;
          } catch (e) {
            results[Number(id)] = undefined;
          }
        }

        setLoadedParts(results);
      }
    };

    loadParts();
  }, [oneRepair?.partsNeed, dispatch]);

 
 const handleRepairClose = async () => {
if (!userr?.id) return;
const resultAction = await dispatch(addHistoryRepair({
      date: new Date(),
      step: 'Envoyé à CQ',
      user: { id: userr.id || 0 },
      repair: oneRepair?.id || 0
    }));
    if (!userr?.id || !userr.branch) return;

  const branchId = typeof userr.branch === 'object' ? userr.branch.id : userr.branch;
  if (!branchId || isNaN(userr.id)) return;

        if (addHistoryRepair.fulfilled.match(resultAction)) {
          dispatch(getByUserStep({
              branchId ,
              userId: userr.id,
              step: 'On réparation'
            }));
            navigate(`/dashboard/listTotal`);
        } else {
          notify(`Erreur lors de l'envoi : ${resultAction.payload}`, 'error');
        }
 }
  return (
    <Box sx={{ width: '100%', height: '100vh', padding: 2 }}>
      <Card sx={{
        width: '100%',
        height: '200%'
      }}>
        {id && <ShowHeadRepair idRep={id} />} < br />
        <Divider ></Divider>< br />
        <Box sx={{
          display: 'flex'
        }}>
          <Table>
            <TableRow>
              <TableCell>Garantie</TableCell>
              <TableCell>
                <Select onChange={handleChange}
                  sx={{
                    width: '400px'
                  }}
                >
                  <MenuItem value="true">Sous garantie</MenuItem>
                  <MenuItem value="false">Hors garantie</MenuItem>
                </Select>
              </TableCell>
              {
                oneRepair?.warrenty === true ? <TableCell>Sous garantie</TableCell> : <TableCell>Hors garantie</TableCell>
              }
            </TableRow>

            <Divider sx={{ width: '300%' }} />

            <TableRow>
              <TableCell>La garantie ne couvre pas les cas suivant</TableCell>
              <TableCell>
                <CustomAutocomplete

                  data={expertiseRaison.ExpertiseRaisons}
                  displayFields={['name']}
                  idField="id"
                  label="Raison d\'expertise"
                  multiple={true}

                  onChange={SelectExpertise}

                />
              </TableCell>
              <TableCell>
                {oneRepair?.expertiseReason && oneRepair.expertiseReason.length > 0 ? (
                  <ul>
                    {oneRepair.expertiseReason.map((item) => {
                      // Vérifie si c’est un nombre ou un objet
                      const itemId = typeof item === 'number' ? item : item.id;
                      const reason = expertiseRaison.ExpertiseRaisons.find((r) => r.id === itemId);
                      return reason ? (
                        <li key={itemId}>{reason.name}</li>
                      ) : (
                        <li key={itemId}>Raison inconnue</li>
                      );
                    })}
                  </ul>
                ) : (
                  <Box sx={{ color: 'gray' }}>Pas de cause sélectionnée</Box>
                )}
              </TableCell>


            </TableRow>

            <Divider sx={{ width: '300%' }} />

            <TableRow>
              <TableCell>Notes pour client</TableCell>
              <TableCell>
                <CustomAutocomplete

                  data={NotesClient}
                  displayFields={['name']}
                  idField="id"
                  label="Notes pour client"
                  multiple={true}

                  onChange={SelectNotes}

                />
              </TableCell>
              <TableCell>
                {oneRepair?.notesCustomer && oneRepair.notesCustomer.length > 0 ? (
                  <ul>
                    {oneRepair.notesCustomer.map((item) => {
                      // Vérifie si c’est un nombre ou un objet
                      const itemsId = typeof item === 'number' ? item : item.id;
                      const oneItem = NotesClient.find((r) => r.id === itemsId);
                      return oneItem ? (
                        <li key={itemsId}>{oneItem.name}</li>
                      ) : (
                        <li key={itemsId}>note inconnue</li>
                      );
                    })}
                  </ul>
                ) : (
                  <Box sx={{ color: 'gray' }}>Pas de note sélectionnée</Box>
                )}
              </TableCell>
            </TableRow>

            <Divider sx={{ width: '300%' }} />

            <TableRow>
              <TableCell>Remarque</TableCell>
              <TableCell>
                <Input id="standard-basic"
                  sx={{ width: '400px' }}
                  value={formRepair?.remark}
                  onChange={(e) => setFormRepair({ ...formRepair, remark: e.target.value })} />
              </TableCell>
              <TableCell>{formRepair?.remark}</TableCell>
            </TableRow>

            <Divider sx={{ width: '300%' }} />

            <TableRow>
              <TableCell>Action sur l'appareille</TableCell>
              <TableCell>
                <CustomAutocomplete

                  data={repairActions}
                  displayFields={['name']}
                  idField="id"
                  label="Action après diagnostique"
                  multiple={false}
                  onChange={SelectAction}
                />
              </TableCell>
              <TableCell>
                {oneRepair?.repairAction && oneRepair.repairAction.length > 0 ? (
                  <ul>
                    {oneRepair.repairAction.map((item) => {
                      // Vérifie si c’est un nombre ou un objet
                      const itemsId = typeof item === 'number' ? item : item.id;
                      const oneItem = repairActions.find((r) => r.id === itemsId);
                      return oneItem ? (
                        <li key={itemsId}>{oneItem.name}</li>
                      ) : (
                        <Box sx={{ color: 'gray' }} key={itemsId}>Action inconnue</Box>
                      );
                    })}

                  </ul>
                ) : (
                  <Box sx={{ color: 'gray' }}>Pas d'action sélectionnée</Box>
                )}
              </TableCell>
            </TableRow>

            <Divider sx={{ width: '300%' }} />

            <TableRow>
              <TableCell sx={{ width: '25%' }}>Besoin des pièces</TableCell>
              <TableCell sx={{ width: '40%' }}>
                <CustomCheckboxSelector
                  data={Array.isArray(BespartsNeed) && typeof BespartsNeed[0] === 'object'
                    ? (BespartsNeed as TypeModel[])
                    : []}
                  displayFields={['description']}
                  returnField="id"
                  title='Pièces'
                  //maxSelection={3}
                  onChange={(values) => setFormRepair({ ...formRepair, partsNeed: values })}
                />
              </TableCell>
              <TableCell>
                {Array.isArray(oneRepair?.partsNeed) && oneRepair.partsNeed.length > 0 ? (
                  <ul>
                    {oneRepair.partsNeed.map((itemId) => {
                      const part = loadedParts[itemId];
                      return (
                        <li key={itemId}>
                          {part ? part.description : <Box sx={{ color: 'gray' }}>Pièce inconnue</Box>}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <Box sx={{ color: 'gray' }}>Pas de pièce sélectionnée</Box>
                )}
              </TableCell>


            </TableRow>

            <Divider sx={{ width: '300%' }} />

            <TableRow>
              <TableCell>Image à joindre</TableCell>

              {/* <TableCell>
                <Box sx={underlineInputStyles}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ border: 'none', outline: 'none', width: '100%' }}
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        const existing = (formRepair?.files as File[]) ?? [];
                        const newFiles = Array.from(files);

                        const totalFiles = existing.length + newFiles.length;

                        if (totalFiles > 4) {
                          alert("Vous ne pouvez sélectionner que 4 images maximum.");
                        }

                        const combined = [...existing, ...newFiles].slice(0, 4);

                        setFormRepair({
                          ...formRepair,
                          files: combined,
                        });
                      }
                    }}
                  />

                   
                  <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    {formRepair?.files?.map((file, index) => {
                      const isFile = file instanceof File;

                      return (
                        <Box key={index} sx={{ position: 'relative' }}>
                          <img
                            src={isFile ? URL.createObjectURL(file) : file}
                            alt={`image-${index}`}
                            style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => {
                              const updatedFiles = [...formRepair.files!];
                              updatedFiles.splice(index, 1);

                              setFormRepair({
                                ...formRepair,
                                files: updatedFiles as File[], // ou as string[] si tu es sûr
                              });

                            }}
                            sx={{
                              position: 'absolute',
                              top: 0,
                              right: 0,
                              backgroundColor: 'rgba(255,255,255,0.7)',
                            }}
                          >
                            ❌
                          </IconButton>
                        </Box>
                      );
                    })}

                  </Box>

                   <Box sx={{ mt: 1, fontSize: '0.9em', color: 'gray' }}>
                    {formRepair?.files?.length ?? 0} / 4 images sélectionnées
                  </Box>
                </Box>
              </TableCell>
 */}


              <TableCell>
                {oneRepair?.files && oneRepair.files.length > 0 ? (
                  <Box display="flex" gap={1} flexWrap="wrap">

                    {/* Fichiers côté serveur (nom string) */}
                    {oneRepair.files
                      .filter((file) => typeof file === 'string')
                      .map((fileName, index) => (
                        <img
                          key={index}
                          src={`http://localhost:3000/upload/${fileName}`}
                          alt={`repair-file-${index}`}
                          style={{ width: 150, height: 150, objectFit: 'cover', borderRadius: 4 }}
                        />
                      ))}

                    {/* Fichiers uploadés localement (File) */}
                    {oneRepair.files
                      .filter((file): file is File => file instanceof File && file.type.startsWith("image/"))
                      .map((file, index) => (
                        <img
                          key={`local-${index}`}
                          src={URL.createObjectURL(file)}
                          alt={`local-upload-${index}`}
                          style={{ width: 150, height: 150, objectFit: 'cover', borderRadius: 4 }}
                        />
                      ))}
                  </Box>
                ) : (
                  <Box sx={{ color: 'gray' }}>Aucune image sélectionnée</Box>
                )}
              </TableCell>



            </TableRow>

            <Divider sx={{ width: '300%' }} />

            <br /><br />
            <Button sx={{
              width: '250%',
              marginLeft: '50%',
              background: '#ECEFF1'
            }}
              onClick={handleSave}
            >Enregistrer</Button>


          </Table>



        </Box><br /><br />
<Button
  sx={{
    backgroundColor:theme.palette.primary.main,
    color:'white',
    width:'100%',
    ":hover": {backgroundColor:theme.palette.secondary.main}
  }}
  onClick={handleRepairClose}
      
>Cloturer la rèparation</Button>
      </Card>

    </Box>

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
  width: '400px',

};
const linesTable = {
  lineHeight: '0.9',
  padding: '4px 8px',
  fontSize: '12px',
  background: '#EEEEEE'
}
const linesTable2 = {
  lineHeight: '0.9',
  padding: '4px 8px',
  fontSize: '12px',

}