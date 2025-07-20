// src/theme.d.ts
import '@mui/material/styles';
import { PaletteColor, PaletteColorOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    tertiary: PaletteColor; // Déclare la propriété tertiaire
  }

  interface PaletteOptions {
    tertiary?: PaletteColorOptions; // Déclare la propriété tertiaire dans les options
  }
}
