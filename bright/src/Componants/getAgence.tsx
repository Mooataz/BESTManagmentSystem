
import * as React from 'react';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { createTheme, useTheme, ThemeProvider } from '@mui/material/styles';
import type {Theme} from '@mui/material/styles';

const customTheme = (outerTheme: Theme) =>
  createTheme({
    cssVariables: {
      colorSchemeSelector: 'class',
    },
    palette: {
      mode: outerTheme.palette.mode,
    },
    components: {
      MuiAutocomplete: {
        defaultProps: {
          renderOption: (props, option, state, ownerState) => {
            const { key, ...optionProps } = props;
            return (
              <Box
                key={key}
                sx={{
                  borderRadius: '8px',
                  margin: '5px',
                  [`&.${autocompleteClasses.option}`]: {
                    padding: '8px',
                  },
                }}
                component="li"
                {...optionProps}
              >
                {ownerState.getOptionLabel(option)}
              </Box>
            );
          },
        },
      },
    },
  });

  interface Agency {
    id: number;
    name: string;
    phone: number;
    email: string;
    location: string;
}
 interface TypeAgencie{
    agencies: Agency[];
    onSelect: (agency: Agency | null) => void;
 }
export default function SelectAgencie({agencies, onSelect}:TypeAgencie) {
  // useTheme is used to determine the dark or light mode of the docs to maintain the Autocomplete component default styles.
  const outerTheme = useTheme();
const [value, setValue] = React.useState<Agency | null>(agencies[0] ?? null);
const [inputValue, setInputValue] = React.useState<number | null>(agencies[0]?.id ?? null);
  return (
    <ThemeProvider theme={customTheme(outerTheme)}>
      <Stack spacing={5} sx={{ width: 300 }}>
        <Autocomplete
          options={agencies}
          getOptionLabel={(option ) => `${option.name}`}
          id="Agence Selected by Admin"
           
          renderInput={(params) => (
            <TextField {...params} label="Agence" variant="standard" />
          )}
           value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          onSelect(newValue);
          setInputValue(newValue ? newValue.id : null); // <-- Récupère l'ID
        }}
        />

      </Stack>
    </ThemeProvider>
  );
}