import React from "react";
import { Chip, Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import theme from "../../Theme/theme";

type DataItem = Record<string, any>;

interface CustomCheckboxSelectorProps {
  data: DataItem[];
  displayFields: string[];
  returnField: string;
  maxSelection?: number;
  title?:string;
  disabledIds?: number[];
  exclusiveIds?: number[];
  value?: any[];
  onChange: (selectedValues: any[]) => void;
}

export const CustomCheckboxSelector: React.FC<CustomCheckboxSelectorProps> = ({
  data,
  title,
  displayFields,
  returnField,
  maxSelection = Infinity,
  disabledIds,
  exclusiveIds,
  value,
  onChange,
}) => {
  const [internalIds, setInternalIds] = React.useState<Set<number>>(new Set());

  const selectedIds = value !== undefined
    ? new Set(value.map(v => {
        const found = data.find(d => String(d[returnField]) === String(v));
        return found ? found.id : v;
      }).filter((id): id is number => typeof id === 'number'))
    : internalIds;

  const anyExclusiveSelected = [...selectedIds].some(id => exclusiveIds?.includes(id));

  const toggleSelection = (id: number) => {
    if (exclusiveIds?.includes(id)) {
      const newSet = new Set(selectedIds);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.clear();
        newSet.add(id);
      }
      const result = Array.from(newSet).map(i => data.find(d => d.id === i)?.[returnField]);
      if (value !== undefined) {
        onChange(result);
      } else {
        setInternalIds(newSet);
        onChange(result);
      }
      return;
    }
    if (value !== undefined) {
      const newSet = new Set(selectedIds);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else if (newSet.size < maxSelection) {
        if (anyExclusiveSelected) {
          const exclusiveItem = [...selectedIds].find(i => exclusiveIds?.includes(i));
          if (exclusiveItem !== undefined) newSet.delete(exclusiveItem);
        }
        newSet.add(id);
      }
      onChange(Array.from(newSet).map(i => data.find(d => d.id === i)?.[returnField]));
    } else {
      const newSet = new Set(internalIds);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else if (newSet.size < maxSelection) {
        if (anyExclusiveSelected) {
          const exclusiveItem = [...selectedIds].find(i => exclusiveIds?.includes(i));
          if (exclusiveItem !== undefined) newSet.delete(exclusiveItem);
        }
        newSet.add(id);
      }
      setInternalIds(newSet);
      onChange(Array.from(newSet).map(i => data.find(d => d.id === i)?.[returnField]));
    }
  };



  return (
  
      <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2 }}> 
        <Typography>{title}</Typography> <br/>

      <Box display="flex" flexWrap="wrap" gap={1}>
        {data.map((item) => {
          const isSelected = selectedIds.has(item.id);
          const label = displayFields.map(field => item[field]).join(" - ");
          const isExclusive = exclusiveIds?.includes(item.id);
          const disabledDueToExclusive = anyExclusiveSelected && !isExclusive && !isSelected;

          return (
            <Chip
              key={item.id}
              label={label}
            
              //color={isSelected ? "primary" : "default"}
              variant={isSelected ? "filled" : "outlined"}
              icon={isSelected ? <DoneIcon sx={{ color:  theme.palette.primary.main }} /> : undefined}
              onClick={() => toggleSelection(item.id)}
              sx={{
                backgroundColor: isSelected ? theme.palette.secondary.main: "default" ,
                cursor: disabledDueToExclusive ? "not-allowed" : "pointer",
                borderRadius: "16px",
                px: 1.5,
                py: 0.5,
                opacity: disabledDueToExclusive ? 0.5 : 1,
              }}
              disabled={(!isSelected && (selectedIds.size >= maxSelection || disabledDueToExclusive)) || (isSelected && (disabledIds ?? []).includes(item.id))}
            />
          );
        })}
      </Box>
     
      </Box>
  );
};
