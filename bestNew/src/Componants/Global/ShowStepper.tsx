import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Typography, Tooltip } from '@mui/material';
import type { StateHistoryRepair } from '../../Redux/Types/repairTypes';

type RepairFormState = {
    rows: StateHistoryRepair[]
}

export default function ShowStepper({ rows }: RepairFormState) {
    if (!rows?.length) {
        return <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>Aucun historique</Typography>;
    }

    const sorted = [...rows].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
            <Stepper activeStep={sorted.length}>
                {sorted.map((label, i) => {
                    const user = label.tracability?.[0]?.user;
                    return (
                        <Step key={`${label.step}-${i}`}>
                            <StepLabel>
                                <Typography variant="body2" fontWeight={600}>{label.step}</Typography>
                                <Tooltip title={new Date(label.date).toLocaleString('fr-FR')}>
                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(label.date).toLocaleDateString('fr-FR')}
                                    </Typography>
                                </Tooltip>
                                {user?.name && (
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        {user.name}
                                    </Typography>
                                )}
                            </StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
        </Box>
    )
}
