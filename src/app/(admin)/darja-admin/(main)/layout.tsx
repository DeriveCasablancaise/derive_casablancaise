import Sidebar from '@/components/shared/Sidebar';
import { SignedIn } from '@clerk/nextjs';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="admin-shell flex h-screen overflow-hidden">
      <SignedIn>
        <Sidebar />
      </SignedIn>
      {children}
    </div>
  );
};

export default MainLayout;
