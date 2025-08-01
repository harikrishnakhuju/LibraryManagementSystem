import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import axios from 'axios';
import { Head } from '@inertiajs/react';

type BorrowedBook = {
    id: number;
    title: string;
    author: string;
    category: string;
    edition: string;
    price: number;
};

const BorrowedBooksIndex = () => {
    const [books, setBooks] = useState<BorrowedBook[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() =>  {
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
        </AppLayout>
    );
};

export default BorrowedBooksIndex;
