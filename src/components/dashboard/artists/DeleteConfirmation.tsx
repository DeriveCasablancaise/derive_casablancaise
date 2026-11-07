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
import { cn } from '@/lib/utils';
import { adminButtonClass } from '../admin-ui';
import { deleteArtist } from '@/lib/actions/artists.actions';

export const DeleteConfirmation = ({
  artistId,
  onDelete,
}: {
  artistId: string;
  onDelete: (artistId: string) => void;
}) => {
  let [isPending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger className={adminButtonClass('danger', 'sm')}>
        Supprimer
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-100">
            Etes-vous sur de vouloir supprimer cet artiste?
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
                await deleteArtist(artistId);
                onDelete(artistId);
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
