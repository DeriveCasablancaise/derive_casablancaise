import Image from 'next/image';
import { AdminButton } from './admin-ui';

interface ButtonProps {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
}

const SubmitButton = ({ isLoading, className, children }: ButtonProps) => {
  return (
    <AdminButton type="submit" disabled={isLoading} className={className}>
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Image
            src="/assets/icons/loader.svg"
            alt=""
            width={24}
            height={24}
            className="animate-spin"
          />
          En cours de traitement...
        </div>
      ) : (
        children
      )}
    </AdminButton>
  );
};

export default SubmitButton;
