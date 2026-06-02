"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepairImageUrl = void 0;
const getRepairImageUrl = (file) => {
    if (!file)
        return '/fallback-repair.jpg';
    if (typeof file === 'string') {
        if (file.startsWith('http'))
            return file;
        const cleanFilename = file
            .trim()
            .replace(/^\/+|\/+$/g, '')
            .replace(/\\/g, '/');
        return `http://localhost:3000/upload/repairs/${encodeURIComponent(cleanFilename)}`;
    }
    return URL.createObjectURL(file);
};
exports.getRepairImageUrl = getRepairImageUrl;
//# sourceMappingURL=imageUtils.js.map