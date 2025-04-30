import { SignedIn, SignedOut } from '@clerk/nextjs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LogIn, ShieldCheck, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AdminPage from '@/components/dashboard/AdminPage';

export default async function Home() {
  return (
    <>
      <SignedIn>
        <AdminPage />
      </SignedIn>
      <SignedOut>
        <div className="flex justify-center items-center w-full">
          <Card className="w-full max-w-md bg-dark-300 border-green-700 z-40">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto  w-12 h-12 rounded-full flex items-center justify-center mb-2">
                <ShieldCheck className="size-10" color="green" />
              </div>
              <CardTitle className="text-2xl font-bold text-green-700">
                Admin Access Only
              </CardTitle>
              <CardDescription className="">
                Ceci est une page réservée à l'administrateur du site. Veuillez
                vous connecter pour continuer ou vous inscrire si vous n'avez
                pas encore de compte.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button asChild className="w-full bg-green-700 ">
                  <Link
                    href="/sign-in"
                    className="flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Se connecter
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full bg-gray-300 hover:bg-green-700 text-green-700 hover:text-gray-100"
                >
                  <Link
                    href="/sign-up"
                    className="flex items-center justify-center gap-2  z-10"
                  >
                    <UserPlus className="w-4 h-4" />
                    S'enregistrer
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SignedOut>
    </>
  );
}
