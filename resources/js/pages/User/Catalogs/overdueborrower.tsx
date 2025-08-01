
import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import axios from 'axios';
import { Head } from '@inertiajs/react';
type OverdueBorrower = {
    id: number;
    title: string;
    due_date: string;
    created_at: string;
};

const OverdueBorrowersIndex = () => {
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
        </AppLayout>
    );
};

export default OverdueBorrowersIndex;
