import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
  const { auth } = usePage<{ auth: { user: { name: string } | null } }>().props;

  return (
    <>
        <nav className="flex justify-end m-4 gap-4">
          {auth.user ? (
            <Link
              href={route('dashboard')}
              className="px-6 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href={route('login')}
                className="px-6 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Log In
              </Link>
              <Link
                href={route('register')}
                className="px-6 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Register
              </Link>
            </>
          )}
        </nav>

      <Head title="My Library" />
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC] p-6">
        <h1 className="text-3xl font-bold mb-6">Welcome to the Library Management System</h1>

        <p className="text-center max-w-xl mb-6">
          Easily manage students, staff, and books. Track borrowing history, overdue books, and more!
        </p>

      </div>
    </>
  );
}
