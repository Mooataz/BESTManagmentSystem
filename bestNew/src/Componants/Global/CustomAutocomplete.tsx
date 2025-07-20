import * as React from 'react';
import { Autocomplete, TextField, Stack } from '@mui/material';
import type { Control, FieldError } from 'react-hook-form';
 import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
 import { Controller, useForm } from 'react-hook-form';
 
 

const getNestedValue = (obj: any, path: string): any =>
  path.split('.').reduce((acc, part) => acc?.[part], obj);
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

export function CustomAutocomplete<T>({
  data,
  displayFields,
  idField,
  multiple  ,
  label = 'Select',
  error,
  value,
  onChange,
}: CustomAutocompleteProps<T>) {
  const getLabel = (option: T) =>
    displayFields.map((field) => getNestedValue(option, field)).join(' - ');

  return (
    <Stack spacing={1} sx={{ width: 400 }}>
      <Autocomplete
        multiple={multiple}
        options={data}
        disableCloseOnSelect
        getOptionLabel={getLabel}
        onChange={(_, value) => {
          const selected = multiple
            ? (value as T[]).map((item) => getNestedValue(item, idField))
            : value
            ? getNestedValue(value as T, idField)
            : null;
          onChange(selected);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            variant="standard"
            error={!!error}
            helperText={error}
          />
        )}
      />
    </Stack>
  );
}


 