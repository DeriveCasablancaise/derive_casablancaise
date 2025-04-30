import { UserButton } from '@clerk/nextjs';
import React from 'react';

const Navbar = ({ title }: { title: string }) => {
  return (
    <header className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700 flex justify-between w-full sm:px-6 lg:px-8">
      <div className="max-w-7xl py-4 px-4 ">
        <h1 className="text-2xl font-semibold text-gray-100">{title}</h1>
      </div>
      <UserButton />
    </header>
  );
};

export default Navbar;
