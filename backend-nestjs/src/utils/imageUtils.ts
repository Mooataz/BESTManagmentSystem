const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

export const getRepairImageUrl = (file: string | File): string => {
  if (!file) return '/fallback-repair.jpg';
  
  if (typeof file === 'string') {
    if (file.startsWith('http')) return file;
    
    const cleanFilename = file
      .trim()
      .replace(/^\/+|\/+$/g, '')
      .replace(/\\/g, '/');
    
    return `${BASE_URL}/upload/repairs/${encodeURIComponent(cleanFilename)}`;
  }
  
  return URL.createObjectURL(file);
};