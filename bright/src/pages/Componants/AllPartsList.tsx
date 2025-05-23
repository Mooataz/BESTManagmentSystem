

 
interface Allpart{
    id : number;
    description : string;
}
type AllParts = {
  allParts: Allpart[],
   onChange: (selected: Allpart[]) => void;
}
 type AllPart = {
  allParts: Allpart[],
  options: Allpart[];
  onChange: (selected: Allpart[]) => void;
}
 
import * as React from 'react';
import Autocomplete from '@mui/joy/Autocomplete';

export function AllPartsList({ allParts, onChange }: AllParts) {
  return (
    <Autocomplete
    disableCloseOnSelect
      multiple
      id="tags-default"
      placeholder="Favorites"
      options={allParts}
      getOptionLabel={(option) => option.description}
       onChange={(_, value) => onChange(value)}
      defaultValue={[allParts[1]]}
    /> 
  );
}
export function AllPartsListe({ allParts, onChange, options }: AllPart) {
  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      id="tags-default"
      placeholder="Sélectionnez les pièces"
      options={options}
      value={allParts}
      getOptionLabel={(option) => option.description}
      onChange={(_, value) => onChange(value)}
      sx={{ width: 300 }}
    /> 
  );
}
 