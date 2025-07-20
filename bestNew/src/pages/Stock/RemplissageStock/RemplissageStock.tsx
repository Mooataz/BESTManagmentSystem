
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { CustomAutocomplete } from '../../../Componants/Global/CustomAutocomplete';
import { useAppDispatch } from '../../../Redux/hooks';
import { useNotification } from '../../../Componants/NotificationContext';
import type { RootState } from '../../../Redux/store';
import { useSelector } from 'react-redux';
import { getBin, findByBinName, findByBranchType } from '../../../Redux/Actions/stock/Bin';
import { getByMaterialCode, getOneReference, getReferences, } from '../../../Redux/Actions/stock/References';
import { Box, Button, Typography, TextField } from '@mui/material';
import { AddOneStockPart } from '../../../Redux/Actions/stock/RemplissageStock';
import { getOnePart } from '../../../Redux/Actions/Administration/ListAllPart';
import theme from '../../../Theme/theme';

interface ExcelRow {

    bin: string;
    reference: string;
    remark?: string;
    serialNumber?: string;
}
interface ProcessedItem {
    binId: number;
    originalLine: number;
    referenceId: number;
    remark: string;
    serialNumber: string;
}
export default function RemplissageStock() {
    const dispatch = useAppDispatch();
    const { notify } = useNotification();
    const bin = useSelector((state: RootState) => state.bin.bin);
    const user = useSelector((state: RootState) => state.user.branch?.id);
    const UserID = useSelector((state: RootState) => state.user.id);
    const references = useSelector((state: RootState) => state.references.references);
    const OneReferencePart = useSelector((state: RootState) => state.references.oneReference);
    const part = useSelector((state: RootState) => state.allParts.onePart);
    const [addedStockPartIds, setAddedStockPartIds] = useState<number[]>([]);

    const [formRempStock, setFormRempStock] = React.useState({
        bin: 0,
        reference: 0,
    });
    React.useEffect(() => {
        if (OneReferencePart?.allpart && typeof OneReferencePart.allpart === 'object') {
            const partObj = OneReferencePart.allpart as { id: number }; // 👈 assertion de type
            dispatch(getOnePart(partObj.id));
        } else if (typeof OneReferencePart?.allpart === 'number') {
            dispatch(getOnePart(OneReferencePart.allpart));
        }
    }, [OneReferencePart, dispatch]);


    const [quantity, setQuantity] = React.useState(1);
    const [fields, setFields] = React.useState<Array<{
        id: number;
        remark: string;
        serialNumber: string;
    }>>([]);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isImporting, setIsImporting] = React.useState(false);
    React.useEffect(() => {
        const id = user
        const type = 'Bon'
        if (id) { dispatch(findByBranchType({ id, type })) }
        dispatch(getReferences())

    }, [user, dispatch])

    const handleSelectionBin = async (nb: number) => {
        setFormRempStock({ ...formRempStock, bin: nb });
    };
    const handleSelectionReference = async (nb: number) => {
        setFormRempStock({ ...formRempStock, reference: nb });
    };
    const handleFormStock = async () => {
        if (!formRempStock.bin || !formRempStock.reference || quantity <= 0) {
            notify('Veuillez sélectionner une case, une référence et spécifier une quantité valide', 'error');
            return;
        }

        const newFields = Array.from({ length: quantity }, (_, index) => ({
            id: index + 1,
            remark: '',
            serialNumber: ''
        }));

        setFields(newFields);
    };
    const handleFieldChange = (id: number, field: string, value: string) => {
        setFields(prevFields =>
            prevFields.map(f =>
                f.id === id ? { ...f, [field]: value } : f
            )
        );
    };
    const handleSubmit = async () => {
        if (!formRempStock.bin || !formRempStock.reference || fields.length === 0) {
            notify('Veuillez compléter tous les champs requis', 'error');
            return;
        }

        if (OneReferencePart?.description === 'Carte mère' || OneReferencePart?.description === 'Appareil complet') {
            const hasEmptyFields = fields.some(field => !field.serialNumber?.trim());

            if (hasEmptyFields) {
                notify('Veuillez remplir tous les numéros de série', 'error');
                return;
            }
        }

        setIsSubmitting(true);
        try {
            for (const field of fields) {
                const result = await dispatch(AddOneStockPart({
                    bin: formRempStock.bin,
                    reference: formRempStock.reference,
                    remark: field.remark,
                    serialnumber: field.serialNumber,
                    userId: UserID || 0,
                })).unwrap();
                if (result.id !== undefined) {
                    setAddedStockPartIds(prev => [...prev, result.id as number]);
                }

            }

            notify('Remplissage du stock effectué avec succès', 'success');
            setFields([]);
            setQuantity(1);
            setFormRempStock({
                bin: 0,
                reference: 0,
            });
        } catch (error) {
            notify('Une erreur est survenue lors du remplissage du stock', 'error');
            console.error('Erreur lors du remplissage du stock:', error);
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleImportSubmit = async (importedData: Array<{
        binId: number;
        referenceId: number;
        remark: string;
        serialNumber: string;
    }>) => {
        setIsImporting(true);
        try {
            let successCount = 0;
            let errorCount = 0;
            for (const item of importedData) {
                try {
                    await dispatch(AddOneStockPart({
                        bin: item.binId,
                        reference: item.referenceId,
                        remark: item.remark,
                        serialnumber: item.serialNumber,
                        userId: UserID || 0,
                    })).unwrap();
                    successCount++;
                } catch (error) {
                    console.error(`Erreur lors de l'insertion de l'item:`, error);
                    errorCount++;
                }
            }
            notify(`Importation terminée: ${successCount} succès, ${errorCount} échecs`,
                errorCount > 0 ? 'warning' : 'success');

            // Réinitialiser après import
            setFields([]);
            setQuantity(1);
            setFormRempStock({
                bin: 0,
                reference: 0,
            });
        } catch (error) {
            notify('Une erreur est survenue lors de l\'importation', 'error');
            console.error('Erreur lors de l\'importation:', error);
        } finally {
            setIsImporting(false);
        }
    };
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = e.target?.result;
                if (!data) {
                    notify('Erreur de lecture du fichier', 'error');
                    return;
                }
                // 1. Lecture du fichier Excel
                const workbook = XLSX.read(data, { type: 'binary' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                // 2. Conversion en JSON avec typage strict
                const jsonData = XLSX.utils.sheet_to_json<{
                    bin: string;
                    reference: string;
                    remark?: string;
                    serialnumber?: string;
                }>(worksheet, {
                    raw: false,
                    defval: "",
                    header: ['bin', 'reference', 'remark', 'serialnumber']
                });
                if (jsonData.length === 0) {
                    notify('Le fichier Excel est vide', 'warning');
                    return;
                }
                setIsImporting(true);
                notify('Traitement du fichier en cours...', 'info');
                // 3. Traitement des données ligne par ligne
                const processingResults = await Promise.all(
                    jsonData.map(async (row, index) => {
                        try {
                            // Validation des champs obligatoires
                            if (!row.bin?.trim()) {
                                throw new Error(`Case (bin) manquante ligne ${index + 1}`);
                            }
                            if (!row.reference?.trim()) {
                                throw new Error(`Référence manquante ligne ${index + 1}`);
                            }
                            // Recherche de la case
                            const binResponse = await dispatch(
                                findByBinName(row.bin.trim())
                            ).unwrap();
                            if (!binResponse?.id) {
                                throw new Error(`Case "${row.bin}" non trouvée`);
                            }
                            // Recherche de la référence
                            const refResponse = await dispatch(
                                getByMaterialCode(row.reference.trim())
                            ).unwrap();
                            if (!refResponse?.id) {
                                throw new Error(`Référence "${row.reference}" non trouvée`);
                            }
                            return {
                                success: true,
                                data: {
                                    binId: binResponse.id,
                                    referenceId: refResponse.id,
                                    remark: row.remark?.trim() || '',
                                    serialNumber: row.serialnumber?.trim() || '',
                                    originalLine: index + 1
                                },
                                error: null
                            };
                        } catch (error) {
                            return {
                                success: false,
                                data: null,
                                error: error instanceof Error
                                    ? error.message
                                    : `Erreur inconnue ligne ${index + 1}`
                            };
                        }
                    })
                );
                // 4. Séparation des succès et erreurs
                const successfulItems = processingResults
                    .filter(result => result.success)
                    .map(result => result.data) as ProcessedItem[];
                const failedItems = processingResults
                    .filter(result => !result.success)
                    .map(result => result.error);
                // 5. Affichage des résultats
                if (failedItems.length > 0) {
                    notify(
                        `${failedItems.length} erreur(s) lors de l'importation`,
                        'warning'
                    );
                    console.error('Erreurs:', failedItems);
                }
                if (successfulItems.length === 0) {
                    notify('Aucune donnée valide à importer', 'warning');
                    return;
                }
                // 6. Mise à jour de l'état
                setFields(
                    successfulItems.map(item => ({
                        id: item.originalLine,
                        remark: item.remark,
                        serialNumber: item.serialNumber
                    }))
                );
                setFormRempStock({
                    bin: successfulItems[0].binId,
                    reference: successfulItems[0].referenceId
                });
                // 7. Confirmation avant import final
                if (
                    window.confirm(
                        `${successfulItems.length} éléments prêts à être importés. ` +
                        `Confirmer l'importation?`
                    )
                ) {
                    await handleImportSubmit(successfulItems);
                } else {
                    notify(
                        `${successfulItems.length} éléments chargés mais non importés. ` +
                        `Cliquez sur "Valider" pour confirmer.`,
                        'info'
                    );
                }
            } catch (error) {
                notify('Erreur lors du traitement du fichier', 'error');
                console.error('Erreur:', error);
            } finally {
                setIsImporting(false);
            }
        };
        reader.readAsBinaryString(file);
    };
    return (
        <div style={{ width: '100%' }}>
            <Typography variant="h6">Remplir le stock</Typography>
            <br />
            <Button
                variant="outlined"
                component="label"
                color="primary"
                disabled={isImporting}
                sx={{
                    marginRight: '70%',
                    borderColor: theme.palette.secondary.main,
                    color: theme.palette.secondary.main,
                }}
            >
                {isImporting ? 'Importation en cours...' : 'Importer depuis Excel'}
                <input
                    type="file"
                    hidden
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    disabled={isImporting}
                />
            </Button> <br />
            <form>
                <Box sx={{ display: 'flex', justifyContent: 'space-around', gap: 3, mb: 3 }}>
                    <CustomAutocomplete
                        data={bin}
                        displayFields={['name']}
                        idField="id"
                        label="Case"
                        multiple={false}
                        onChange={handleSelectionBin}
                        value={formRempStock.bin}
                    />
                    <CustomAutocomplete
                        data={references}
                        displayFields={['materialCode']}
                        idField="id"
                        label="Reference"
                        multiple={false}
                        onChange={handleSelectionReference}
                        value={formRempStock.reference}
                    />
                    <TextField
                        id="quantity-input"
                        label="Quantitè"
                        variant="standard"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        inputProps={{ min: 1 }}
                    />
                    <Button
                        variant='outlined'
                        onClick={handleFormStock}
                        disabled={!formRempStock.bin || !formRempStock.reference || quantity <= 0}
                        color='success'
                    >
                        Générer les champs
                    </Button>

                </Box>
                {fields.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            {isImporting ? 'Traitement des données...' : 'Veuillez vérifier les données avant validation:'}
                        </Typography>
                        {fields.map((field) => (
                            <Box key={field.id} sx={{
                                display: 'flex',
                                gap: 2,
                                mb: 2,
                                p: 2,
                                border: '1px solid #ddd',
                                borderRadius: 1,
                                backgroundColor: isImporting ? '#f5f5f5' : 'inherit'
                            }}>
                                <TextField
                                    fullWidth
                                    label={`Numéro de série #${field.id}`}
                                    value={field.serialNumber}
                                    onChange={(e) => handleFieldChange(field.id, 'serialNumber', e.target.value)}
                                    required
                                    disabled={isImporting || isSubmitting}
                                />
                                <TextField
                                    fullWidth
                                    label={`Remarque #${field.id}`}
                                    value={field.remark}
                                    onChange={(e) => handleFieldChange(field.id, 'remark', e.target.value)}
                                    disabled={isImporting || isSubmitting}
                                />
                            </Box>
                        ))}
                        <Button
                            variant="outlined"
                            color='success'
                            onClick={handleSubmit}
                            sx={{ mt: 2 }}
                            disabled={isSubmitting || isImporting}
                        >
                            {isSubmitting ? 'Enregistrement en cours...' : 'Valider le remplissage'}
                        </Button>
                    </Box>
                )}
            </form>
        </div>
    );
}  