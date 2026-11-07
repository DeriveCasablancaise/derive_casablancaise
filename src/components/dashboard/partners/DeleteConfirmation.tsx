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
import { AdminButton, adminButtonClass } from '../admin-ui';
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
        <AdminButton variant="danger" size="sm" className="my-4 mx-2">
          Supprimer
        </AdminButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
        <AlertDialogDescription>
          Cette action ne peut pas être annulée. Ce partenaire sera supprimé
          définitivement.
        </AlertDialogDescription>
        <div className="flex justify-end gap-4">
          <AlertDialogCancel className={adminButtonClass('secondary')}>
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className={adminButtonClass('danger')}
          >
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
