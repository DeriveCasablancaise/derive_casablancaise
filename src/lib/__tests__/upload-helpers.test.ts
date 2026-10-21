import { describe, expect, it, vi } from 'vitest';
import { containsBlobUrl, uploadFilesOrThrow } from '../upload-helpers';

const file = new File(['a'], 'a.png');

describe('uploadFilesOrThrow', () => {
  it('throws on an empty result', async () => {
    await expect(uploadFilesOrThrow(async () => [], [file])).rejects.toThrow();
    await expect(uploadFilesOrThrow(async () => undefined, [file])).rejects.toThrow();
  });

  it('throws when a url is missing', async () => {
    const start = vi.fn().mockResolvedValue([{ url: '' }]);
    await expect(uploadFilesOrThrow(start, [file])).rejects.toThrow();
  });

  it('returns the urls', async () => {
    const start = vi
      .fn()
      .mockResolvedValue([{ url: 'https://a/1.png' }, { url: 'https://a/2.png' }]);
    await expect(uploadFilesOrThrow(start, [file, file])).resolves.toEqual([
      'https://a/1.png',
      'https://a/2.png',
    ]);
  });
});

describe('containsBlobUrl', () => {
  it('finds blob urls in nested values', () => {
    expect(containsBlobUrl({ images: ['https://a/1.png', 'blob:http://x/1'] })).toBe(true);
    expect(containsBlobUrl({ images: ['https://a/1.png'], n: 1 })).toBe(false);
  });
});
