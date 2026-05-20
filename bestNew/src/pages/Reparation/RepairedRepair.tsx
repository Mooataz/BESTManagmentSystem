import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import type { RootState } from '../../Redux/store';
import { useAppDispatch } from '../../Redux/hooks';
import { getByUserStep, getOneRepair, UpdateOneRepair, UpdatePartFileRepair } from '../../Redux/Actions/Reception/repairAction';
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
  const userr = useSelector((state: RootState) => state.auth.user)
  const expertiseRaison = useSelector((state: RootState) => state.expertiseReasons);
  const NotesClient = useSelector((state: RootState) => state.NotesCustomer.notesCustomer);
  const repairActions = useSelector((state: RootState) => state.RepairAction.repairAction);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const oneRepair = useSelector((state: RootState) => state.repair.oneRepair);
  const [formRepair, setFormRepair] = useState<RepairForm>();


  useEffect(() => {
    if (oneRepair) {
      setFormRepair({
        warrenty: oneRepair.warrenty,
        remark: oneRepair.remark,
        expertiseReason: oneRepair.expertiseReason
          ?.map((r) => (typeof r === 'number' ? r : r.id))
          .filter((id): id is number => typeof id === 'number'),

        notesCustomer: oneRepair.notesCustomer
          ?.map((n) => (typeof n === 'number' ? n : n.id))
          .filter((id): id is number => typeof id === 'number'),


        repairAction: oneRepair.repairAction
          ?.map((a) => (typeof a === 'number' ? a : a.id))
          .filter((id): id is number => typeof id === 'number'),


        partsNeed: oneRepair.partsNeed,
      });
    }
  }, [oneRepair]);
  useEffect(() => {
    dispatch(getAllExpertiseRaisons())
  }, [dispatch])

  useEffect(() => {
    if (id) { dispatch(getOneRepair(Number(id))); }
  }, [dispatch, id]);



  const allParts =
    typeof oneRepair?.device === 'object' &&
      typeof oneRepair.device.model === 'object' &&
      Array.isArray(oneRepair.device.model.allpart) &&
      oneRepair.device.model.allpart.every(
        (p): p is TypeModel => typeof p === 'object'
      )
      ? oneRepair.device.model.allpart
      : [];


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
  /* ===============================
     IMAGES HANDLERS
  =============================== */
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files).filter(file =>
      file.type.startsWith('image/')
    );

    if (selectedImages.length + files.length > 4) {
      notify('Maximum 4 images autorisées', 'warning');
      return;
    }

    setSelectedImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };
  /* ===============================
       SAFE FILES ACCESS ✅
    =============================== */
  const files = oneRepair?.files ?? [];

  /* ===============================
   SAVE (DATA + IMAGES)
=============================== */
  const handleSave = async () => {
    if (!oneRepair?.id || !formRepair) {
      notify('Réparation introuvable', 'error');
      return;
    }

    // ✅ 1. Sauvegarde données
    const updateResult = await dispatch(
      UpdateOneRepair({
        id: oneRepair.id,
        ...formRepair,
      })
    );

    if (!UpdateOneRepair.fulfilled.match(updateResult)) {
      notify('Erreur lors de la mise à jour', 'error');
      return;
    }

    // ✅ 2. Upload images (si présentes)
    if (selectedImages.length > 0) {
      const formData = new FormData();
      selectedImages.forEach(file => {
        formData.append('files', file);
      });

      const uploadResult = await dispatch(
        UpdatePartFileRepair({
          id: oneRepair.id,
          data: formData,
        })
      );

      if (!UpdatePartFileRepair.fulfilled.match(uploadResult)) {
        notify(
          'Réparation mise à jour mais erreur images',
          'warning'
        );
        return;
      }
    }

    notify('Réparation enregistrée avec succès ✅', 'success');
    setSelectedImages([]);
    dispatch(getOneRepair(oneRepair.id));
  };



  {/*
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
  */}

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
                    {oneRepair!.expertiseReason.map((item) => {
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
                  data={allParts}
                  displayFields={['description']}
                  returnField="id"
                  title="Pièces"
                  onChange={(values) =>
                    setFormRepair({ ...formRepair, partsNeed: values })
                  }
                />



              </TableCell>
              <TableCell>
                {Array.isArray(oneRepair?.partsNeed) && oneRepair.partsNeed.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    {oneRepair.partsNeed.map((itemId) => (
                      <li key={itemId}>Pièce ID : {itemId}</li>
                    ))}
                  </ul>
                ) : (
                  <Box sx={{ color: "gray" }}>
                    Pas de pièce sélectionnée
                  </Box>
                )}
              </TableCell>


            </TableRow>

            <Divider sx={{ width: '300%' }} />

            {/* IMAGES */}
            <TableRow>
              <TableCell>Images (max 4)</TableCell>

              <TableCell>
                <Button variant="outlined" component="label">
                  Ajouter des images
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                  />
                </Button>

                {selectedImages.length > 0 && (
                  <Box mt={2} display="flex" gap={1} flexWrap="wrap">
                    {selectedImages.map((file, index) => (
                      <Box key={index} position="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          width={100}
                          height={100}
                          style={{ objectFit: 'cover', borderRadius: 4 }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeImage(index)}
                          sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            background: 'white'
                          }}
                        >
                          ✖
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </TableCell>

              <TableCell>
                {files.length > 0 ? (
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {files.map((f: any, index: number) => (
                      <img
                        key={f.id ?? index}
                        src={f.url}
                        alt="uploaded"
                        width={100}
                        height={100}
                        style={{ objectFit: 'cover', borderRadius: 4 }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Box color="gray">Aucune image existante</Box>
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
        {/*
        <Button
  sx={{
    backgroundColor:theme.palette.primary.main,
    color:'white',
    width:'100%',
    ":hover": {backgroundColor:theme.palette.secondary.main}
  }}
  onClick={handleRepairClose}
      
>Cloturer la rèparation</Button>
        */}

      </Card>

    </Box>

  )
}
