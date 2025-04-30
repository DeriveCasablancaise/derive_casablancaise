import Image from 'next/image';
import { Button } from '../ui/button';

interface ButtonProps {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
}

const SubmitButton = ({ isLoading, className, children }: ButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={
        className ??
        ' w-full p-4 bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl  border border-gray-700 my-4'
      }
      variant="outline"
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Image
            src="/assets/icons/loader.svg"
            alt="loader"
            width={24}
            height={24}
            className="animate-spin"
          />
          En cours de traitement...
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
