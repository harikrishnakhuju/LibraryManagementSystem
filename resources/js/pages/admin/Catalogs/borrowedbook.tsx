import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import axios from 'axios';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { BookOpen, Clock } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import { cn } from '@/lib/utils';

type BorrowedBook = {
    id: number;
    title: string;
    author: string;
    category: string;
    edition: string;
    price: number;
};

const tabs = [
  {
    name: 'Borrowed Books',
    href: '/admin/catalog/borrowed-books',
    icon: BookOpen,
  },
  {
    name: 'Overdue Borrowers',
    href: '/admin/catalog/overdue-borrowers',
    icon: Clock,
  },
];

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Catalog',
    href: 'admin/catalog',
  },
];



const BorrowedBooksIndex = ( { children }: { children: React.ReactNode }) => {
    const location = typeof window !== 'undefined' ? window.location.pathname : '';
    const [books, setBooks] = useState<BorrowedBook[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // axios.get('/api/borrowed-books')
        axios.get('/api/books')
            .then(res => {
                setBooks(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);


    return (
        <AppLayout breadcrumbs={[{ title: 'Borrowed Books', href: '/borrowed-books' }]}>
            <Head title="Borrowed Books" />
            <div className="p-6">
                {/* Tab Navigation */}
                <div className="flex space-x-4 border-b mb-4">
                    {tabs.map((tab) => {
                        const isActive = location === tab.href;
                        return (
                            <Link
                                key={tab.name}
                                href={tab.href}
                                className={cn(
                                    'flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-t-md',
                                    isActive
                                        ? 'border-b-2 border-primary text-primary bg-muted'
                                        : 'text-muted-foreground hover:text-primary'
                                )}
                            >
                                <tab.icon size={16} />
                                <span>{tab.name}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Borrowed Books</h1>
                {loading ? <p>Loading...</p> : (
                    <table className="table-auto w-full border">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-2 border">Name</th>
                                <th className="p-2 border">Author</th>
                                <th className="p-2 border">Category</th>
                                <th className="p-2 border">Edition</th>
                                <th className="p-2 border">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
                                <tr key={book.id}>
                                    <td className="p-2 border">{book.title}</td>
                                    <td className="p-2 border">{book.author}</td>
                                    <td className="p-2 border">{book.category}</td>
                                    <td className="p-2 border">{book.edition}</td>
                                    <td className="p-2 border">Rs. {book.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>


            </div>
        </AppLayout>
    );
};

export default BorrowedBooksIndex;
