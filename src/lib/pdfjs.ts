// Only the reader imports this, after it opens, so pdf.js stays out of the page bundles.
// The legacy build still runs on Safari before 17.4 (no Promise.withResolvers).
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist/legacy/build/pdf';

// webpack copies the worker of the same package version next to the chunks
GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/legacy/build/pdf.worker.min.js',
  import.meta.url,
).toString();

export { getDocument };
