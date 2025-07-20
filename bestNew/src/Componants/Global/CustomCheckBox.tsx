 /* 
export interface CustomAutocompleteProps<T> {
  data: T[];
  displayFields: string[];
  idField: string;
  multiple?: boolean;
  label?: string;
  error?: string;
  value?: any;
  onChange: (selectedIds: any[] | any | null) => void;
}
export function CustomCheckBox<T>({
data,
  displayFields,
  idField,
  multiple  ,
  label = 'Select',
  error,
  value,
  onChange,
}: CustomAutocompleteProps<T>){
    return(
        <Box>
            {
                data.map( (item, index) => { return(
                    <Box>
                    
                    </Box>
                )})
            }
            
                      
             

        </Box>
    )
}
 */

import React from 'react';
import {
  Box,
  Checkbox,
  Chip,
  Typography,
  Stack
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';

export interface TypeUnique {
  id: number | string;
  name: string;
}

interface ChoiceChipCheckboxProps {
  title:string;
  data: TypeUnique[];
  onChange: (selected: TypeUnique[]) => void;
}

export default function CustomCheckBox<T>({
  title,
  data,
  onChange,
}: ChoiceChipCheckboxProps) {
  const [value, setValue] = React.useState<TypeUnique[]>([]);

  const toggleSelection = (item: TypeUnique) => {
    setValue((prev) => {
      const exists = prev.find((v) => v.id === item.id);
      const updated = exists
        ? prev.filter((v) => v.id !== item.id)
        : [...prev, item];

      onChange(updated);
      return updated;
    });
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        {title}
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {data.map((item) => {
          const isSelected = value.some((v) => v.id === item.id);
          return (
            <Chip
              key={item.id}
              label={item.name}
              color={isSelected ? 'primary' : 'default'}
              variant={isSelected ? 'filled' : 'outlined'}
              onClick={() => toggleSelection(item)}
              icon={isSelected ? <DoneIcon /> : undefined}
              sx={{
                cursor: 'pointer',
                borderRadius: '16px',
                px: 1.5,
                py: 0.5,
              }}
            />
          );
        })}
      </Stack>
    </Box>
  );
}
