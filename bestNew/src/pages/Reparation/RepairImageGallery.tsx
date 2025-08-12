// components/RepairImageGallery.tsx
import { useState } from 'react';
import { getRepairImageUrl } from './imageUtils';
import { Box } from '@mui/material';
 

const RepairImageGallery = ({ files }: { files: Array<string | File> }) => {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = (src: string) => {
    setFailedImages(prev => new Set(prev).add(src));
  };

  return (
    <Box display="flex" gap={1} flexWrap="wrap">
      {files?.map((file, index) => {
        const imgSrc = getRepairImageUrl(file);
        const isFailed = failedImages.has(imgSrc);
        
        return isFailed ? null : (
          <img
            key={index}
            src={imgSrc}
            alt={`repair-document-${index}`}
            style={{ 
              width: 150, 
              height: 150, 
              objectFit: 'cover', 
              borderRadius: 4 
            }}
            onError={() => handleImageError(imgSrc)}
          />
        );
      })}
    </Box>
  );
};