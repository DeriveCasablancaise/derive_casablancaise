import { getUserById } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';
import { LogIn, ShieldX } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Navbar from '../shared/Navbar';
import MainPage from './MainPage';

const AdminPage = async () => {
  const activeUser = await currentUser();

  if (!activeUser) {
    redirect('/sign-in');
    return null; // Ensure no component renders if redirecting
  }

  const currentUserFromDb = await getUserById(activeUser.id);
  const isAdmin = currentUserFromDb.isAdmin;

  if (!currentUserFromDb) {
    redirect('/sign-in');
    return null;
  }

  return (
    <>
      {isAdmin ? (
        <div className="flex-1 overflow-auto relative z-10">
          <Navbar title="Espace Darja Admin" />
          <MainPage />
        </div>
      ) : (
        <div className="flex justify-center items-center w-full">
          <Card className="w-full max-w-md bg-dark-300 border-red-700 z-40">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto  w-12 h-12 rounded-full flex items-center justify-center mb-2">
                <ShieldX className="size-10 " color="Red" />
              </div>
              <CardTitle className="text-2xl font-bold text-red-700">
                Vous n'êtes pas Admin
              </CardTitle>
              <CardDescription className="">
                Notre équipe a vérifié votre statut actuel, malheureusement vous
                n'êtes pas autorisé à commettre de changement sur ce panel.
                N'hésitez pas à parcourir le contenu de notre site Web en tant
                que visiteur. Merci.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full bg-red-700 ">
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Retour
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default AdminPage;
