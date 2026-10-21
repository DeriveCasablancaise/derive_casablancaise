type StartUpload = (files: File[]) => Promise<{ url: string }[] | undefined>;

export async function uploadFilesOrThrow(
  startUpload: StartUpload,
  files: File[],
): Promise<string[]> {
  const result = await startUpload(files);

  if (!result || result.length === 0) {
    throw new Error('Upload failed');
  }

  const urls = result.map((file) => file?.url);
  if (urls.length !== files.length || urls.some((url) => !url)) {
    throw new Error('Upload failed');
  }

  return urls;
}

// true if any string (nested too) is a blob: preview url
export function containsBlobUrl(value: unknown): boolean {
  if (typeof value === 'string') return value.startsWith('blob:');
  if (Array.isArray(value)) return value.some(containsBlobUrl);
  if (value && typeof value === 'object') {
    return Object.values(value).some(containsBlobUrl);
  }
  return false;
}
