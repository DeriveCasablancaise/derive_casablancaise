'use client';

import { useTransition } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { adminButtonClass } from '../admin-ui';
import { deletePost } from '@/lib/actions/post.actions';
import { usePathname } from 'next/navigation';

export const DeleteConfirmation = ({
  postId,
  onDelete,
}: {
  postId: string;
  onDelete: (postId: string) => void;
}) => {
  const pathname = usePathname();
  let [isPending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger className={adminButtonClass('danger', 'sm')}>
        Supprimer
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-100">
            Etes-vous sur de vouloir supprimer ce poste?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-100">
            Cette action est permanente
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className={adminButtonClass('secondary')}>
            Annuler
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={() =>
              startTransition(async () => {
                await deletePost({ postId, path: pathname });
                onDelete(postId);
              })
            }
            className={adminButtonClass('danger')}
          >
            {isPending ? 'En cours...' : 'Supprimer'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
