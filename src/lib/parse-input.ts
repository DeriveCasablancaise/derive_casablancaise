import type { z } from 'zod';
import { containsBlobUrl } from './upload-helpers';

// call before the try block so the error isn't swallowed by handleError
export function parseInput<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
): z.infer<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    console.error('Invalid data', result.error.flatten().fieldErrors);
    throw new Error('Invalid data');
  }

  if (containsBlobUrl(result.data)) {
    console.error('Invalid data: blob url received');
    throw new Error('Invalid data');
  }

  return result.data;
}
