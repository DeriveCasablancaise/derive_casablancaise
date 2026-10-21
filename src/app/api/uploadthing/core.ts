import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { clerkClient } from '@clerk/nextjs/server';

import { connectToDatabase } from '@/lib/database';
import User from '@/lib/database/models/user.model';

const f = createUploadthing();

// The Clerk middleware ignores /api/uploadthing, so auth() isn't available here.
// I read the session straight from the request instead.
const getAdminId = async (req: Request) => {
  try {
    // the body is already consumed, so I only forward url and headers
    const headersOnly = new Request(req.url, { headers: req.headers });
    const requestState = await clerkClient.authenticateRequest(headersOnly);

    const userId = requestState.toAuth()?.userId;

    if (!userId) return null;

    await connectToDatabase();
    const user = await User.findOne({ clerkId: userId }).lean<{
      isAdmin?: boolean;
    }>();

    return user?.isAdmin === true ? userId : null;
  } catch (e) {
    console.error('uploadthing auth error:', e);
    return null;
  }
};

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB', maxFileCount: 10 } })
    .middleware(async ({ req }) => {
      const userId = await getAdminId(req);

      if (!userId) throw new UploadThingError('Unauthorized');

      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);
      console.log('file url', file.url);

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
