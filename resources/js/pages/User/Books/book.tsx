import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define the Book type
type Book = {
    id: number;
    isbn: string;
    title: string;
    author: string;
    category: string;
    edition: string;
    price: number;
};

const BookIndex = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get<Book[]>('/api/books') // Optional: help axios understand the expected response
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
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Books</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="table-auto w-full border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 border">ISBN</th>
                            <th className="p-2 border">Title</th>
                            <th className="p-2 border">Author</th>
                            <th className="p-2 border">Category</th>
                            <th className="p-2 border">Edition</th>
                            <th className="p-2 border">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <tr key={book.id} className="text-center">
                                <td className="p-2 border">{book.isbn}</td>
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
    );
};

export default BookIndex;
