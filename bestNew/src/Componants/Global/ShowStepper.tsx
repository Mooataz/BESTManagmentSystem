import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Typography } from '@mui/material';
import type { FormHistoryRepair, RepairForm, StateHistoryRepair } from '../../Redux/Types/repairTypes';
type RepairFormState = {
    rows: StateHistoryRepair[]

}
export default function ShowStepper({ rows }: RepairFormState) {
     
    return (
        <div>
            <Box sx={{ width: '100%', display: 'flex' }}>
                <Box>

                    <Typography sx={{ marginTop: '30px' ,color:'gray' }}>Status</Typography>
                    <Typography sx={{ color:'gray' }}> Date </Typography>
                    <Typography sx={{ marginTop: '19px' ,color:'gray'}}>Par</Typography>
                    <br />
                    <br />

                </Box>
                <Stepper activeStep={rows.length} alternativeLabel>
                    {rows.map((label: any) => (
                        <Step key={`${label.step}-${label.date}`}>
                            <StepLabel>
                                <Typography>{label.step}</Typography>
                                <Typography>
                                    {new Date(label.date).toISOString().split('T')[0]} <br />
                                    {new Date(label.date).toTimeString().split(' ')[0]}
                                </Typography>

                                <Typography>{label.tracability[0]?.user.name}</Typography>
                            </StepLabel>

                        </Step>
                    ))}
                </Stepper>


                
            </Box>
        </div>
    )
}
