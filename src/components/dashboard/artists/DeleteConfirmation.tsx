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
import { buttonVariants } from '@/components/ui/button';
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
      <AlertDialogTrigger
        className={cn(
          'capitalize text-red-500 hover:bg-red-500 hover:text-gray-100',
          buttonVariants({ variant: 'ghost' })
        )}
      >
        Supprimer
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border border-gray-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-100">
            Etes-vous sur de vouloir supprimer cet artiste?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-100">
            Cette action est permanente
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>

          <AlertDialogAction
            onClick={() =>
              startTransition(async () => {
                await deleteArtist(artistId);
                onDelete(artistId);
              })
            }
            className="bg-red-600 hover:bg-red-600/40"
          >
            {isPending ? 'En cours...' : 'Supprimer'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
