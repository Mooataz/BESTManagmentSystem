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
  onChange: (selectedValues: any[]) => void;
}

export const CustomCheckboxSelector: React.FC<CustomCheckboxSelectorProps> = ({
  data,
  title,
  displayFields,
  returnField,
  maxSelection = Infinity,
  onChange,
}) => {
  const [selectedIds, setSelectedIds] = React.useState<Set<number>>(new Set());

  const toggleSelection = (id: number) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else if (newSet.size < maxSelection) {
      newSet.add(id);
    }
    setSelectedIds(newSet);
    onChange(Array.from(newSet).map(i => data.find(d => d.id === i)?.[returnField]));
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === data.length) {
      setSelectedIds(new Set());
      onChange([]);
    } else {
      const allIds = new Set(data.slice(0, maxSelection).map(d => d.id));
      setSelectedIds(allIds);
      onChange(Array.from(allIds).map(i => data.find(d => d.id === i)?.[returnField]));
    }
  };

  return (
  
      <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2 }}> 
        <Typography>{title}</Typography> <br/>

      <Box display="flex" flexWrap="wrap" gap={1}>
        {data.map((item) => {
          const isSelected = selectedIds.has(item.id);
          const label = displayFields.map(field => item[field]).join(" - ");

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
                cursor: "pointer",
                borderRadius: "16px",
                px: 1.5,
                py: 0.5,
              }}
              disabled={!isSelected && selectedIds.size >= maxSelection}
            />
          );
        })}
      </Box>
     
      </Box>
  );
};
