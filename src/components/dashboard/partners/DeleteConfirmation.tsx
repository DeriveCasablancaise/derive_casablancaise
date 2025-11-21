'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { deletePartner } from '@/lib/actions/partner.actions';

interface DeleteConfirmationProps {
  partnerId: string;
  onDelete: (partnerId: string) => void;
}

export const DeleteConfirmation = ({
  partnerId,
  onDelete,
}: DeleteConfirmationProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePartner({
        partnerId,
        path: '/darja-admin/partners',
      });
      onDelete(partnerId);
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-md border border-gray-700 my-4 mx-2"
          variant="outline"
        >
          Supprimer
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
        <AlertDialogDescription>
          Cette action ne peut pas être annulée. Ce partenaire sera supprimé
          définitivement.
        </AlertDialogDescription>
        <div className="flex justify-end gap-4">
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
