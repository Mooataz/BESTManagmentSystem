import { describe, it, expect, vi, beforeEach } from 'vitest';
import { API } from '../../services/api';

vi.mock('../../services/api', () => ({
  API: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), put: vi.fn(), delete: vi.fn() },
  API_BASE_URL: 'http://localhost:3000',
}));

describe('PDFActions', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('CreateRepairPDF should GET pdf/repair/{id} and open blob URL', async () => {
    const blob = new Blob(['dummy'], { type: 'application/pdf' });
    (API.get as any).mockResolvedValue({ data: blob });
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    const { CreateRepairPDF } = await import('./PDFActions');
    await CreateRepairPDF(1);
    expect(API.get).toHaveBeenCalledWith('pdf/repair/1', { responseType: 'blob' });
    openSpy.mockRestore();
  });

  it('CreateRepairPDF should throw on failure', async () => {
    (API.get as any).mockRejectedValue(new Error('Network error'));
    const { CreateRepairPDF } = await import('./PDFActions');
    await expect(CreateRepairPDF(1)).rejects.toThrow('Network error');
  });
});
