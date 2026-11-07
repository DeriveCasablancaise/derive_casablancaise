import Link from 'next/link';
import { AdminButton } from './admin-ui';
import SubmitButton from './SubmitButton';

type FormActionsProps = {
  isLoading: boolean;
  submitLabel: string;
  cancelHref: string;
  // a form without required fields has nothing to explain
  showRequiredHint?: boolean;
};

const FormActions = ({
  isLoading,
  submitLabel,
  cancelHref,
  showRequiredHint = true,
}: FormActionsProps) => (
  <div className="admin-actions">
    {showRequiredHint && (
      <p className="admin-help admin-actions-hint">* champ obligatoire</p>
    )}
    <AdminButton asChild variant="secondary">
      <Link href={cancelHref}>Annuler</Link>
    </AdminButton>
    <SubmitButton isLoading={isLoading}>{submitLabel}</SubmitButton>
  </div>
);

export default FormActions;
