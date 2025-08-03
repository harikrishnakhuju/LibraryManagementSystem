
import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import axios from 'axios';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { BookOpen, Clock } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import { cn } from '@/lib/utils';

type OverdueBorrower = {
    id: number;
    title: string;
    due_date: string;
    created_at: string;
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
        href: '/admin/catalog',
    },
];
const OverdueBorrowersIndex = ({ children }: { children: React.ReactNode }) => {
    const location = typeof window !== 'undefined' ? window.location.pathname : '';

    const [borrowers, setBorrowers] = useState<OverdueBorrower[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // axios.get('/api/overdue-borrowers')
        axios.get('/api/books')
            .then(res => {
                setBorrowers(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <AppLayout breadcrumbs={[{ title: 'Overdue Borrowers', href: '/overdue-borrowers' }]}>
            <Head title="Overdue Borrowers" />
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
                    <h1 className="text-2xl font-bold mb-4">Overdue Borrowers</h1>
                    {loading ? <p>Loading...</p> : (
                        <table className="table-auto w-full border">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="p-2 border">Title</th>
                                    <th className="p-2 border">Due Date</th>
                                    <th className="p-2 border">Released Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {borrowers.map((borrower) => (
                                    <tr key={borrower.id}>
                                        <td className="p-2 border">{borrower.title}</td>
                                        <td className="p-2 border">{borrower.due_date}</td>
                                        <td className="p-2 border">{borrower.created_at}</td>
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

export default OverdueBorrowersIndex;
