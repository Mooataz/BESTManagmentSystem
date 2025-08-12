// utils/imageUtils.ts
export const getRepairImageUrl = (file: string | File): string => {
  if (!file) return '/fallback-repair.jpg';
  
  if (typeof file === 'string') {
    // Handle cases where string might already be a full URL
    if (file.startsWith('http')) return file;
    
    // Clean and encode the filename
    const cleanFilename = file
      .trim()
      .replace(/^\/+|\/+$/g, '') // Remove leading/trailing slashes
      .replace(/\\/g, '/'); // Convert Windows paths
    
    return `http://localhost:3000/upload/repairs/${encodeURIComponent(cleanFilename)}`;
  }
  
  // Handle File objects (for local uploads)
  return URL.createObjectURL(file);
};