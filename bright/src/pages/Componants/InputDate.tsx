import { Input } from '@mui/joy';
import React from 'react';
interface Props {
  onChange: (date: Date) => void;
}
export function InputDate({ onChange }: Props) {
  const [value, setValue] = React.useState<Date>();

  const today = new Date().toISOString().split('T')[0]; // format YYYY-MM-DD

  return (
    <Input
      slotProps={{
        input: {
          type: 'date',
          max: today,
        },
      }}
       
       onChange={(e) => {
        const selected = e.target.value;
        if (selected) {
          onChange(new Date(selected)); // ← conversion en Date
        }
      }}
    />
  );
}
  