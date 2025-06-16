import * as React from 'react';
import { Autocomplete, TextField, Stack } from '@mui/material';

interface CustomAutocompleteProps<T> {
  data: T[];
  displayFields: string[]; // Peut inclure des chemins comme "device.id"
  idField: string;         // Peut aussi être un chemin comme "id" ou "device.id"
  multiple?: boolean;
  label?: string;
  onChange: (selectedIds: any[] | any | null) => void;
}

// Fonction utilitaire pour accéder à un champ imbriqué (ex: "device.sn")
const getNestedValue = (obj: any, path: string): any =>
  path.split('.').reduce((acc, part) => acc?.[part], obj);

export function CustomAutocomplete<T>({
  data,
  displayFields,
  idField,
  multiple = false,
  label = 'Select',
  onChange,
}: CustomAutocompleteProps<T>) {
  const getLabel = (option: T) =>
    displayFields.map((field) => getNestedValue(option, field)).join(' - ');

  return (
    <Stack spacing={1} sx={{ width: 400 }}>
      <Autocomplete
        multiple={multiple}
        options={data}
        getOptionLabel={getLabel}
        onChange={(event, newValue) => {
          if (multiple) {
            const ids = (newValue as T[]).map((item) => getNestedValue(item, idField));
            onChange(ids);
          } else {
            const id = newValue ? getNestedValue(newValue as T, idField) : null;
            onChange(id);
          }
        }}
        renderInput={(params) => (
          <TextField {...params} label={label} variant="standard" />
        )}
      />
    </Stack>
  );
}
