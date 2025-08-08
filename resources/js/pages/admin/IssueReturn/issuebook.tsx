import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import axios from 'axios';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { BookOpen, Clock } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import { cn } from '@/lib/utils';

const tabs = [
    {
        name: 'Issue Book',
        href: '/admin/issueReturn/issue-book',
        icon: BookOpen,
    },
    {
        name: 'Return Book',
        href: '/admin/issueReturn/return-book',
        icon: Clock,
    },
];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Issue/Return Books',
        href: 'admin/issueReturn',
    },
];





const IssueBookIndex = ({ children }: { children: React.ReactNode }) => {
    const today = new Date().toISOString().split('T')[0];
    const location = typeof window !== 'undefined' ? window.location.pathname : '';
    const [issueData, setIssueData] = useState({
        book_copy_id: '',
        book_title: '',
        book_author: '',
        user_id: '',
        issueDate: today,
        user_name: '',
        user_role: '',
        user_email: '',
    });

    const [modalType, setModalType] = useState<'issue' | 'return' | null>(null);
    const [returnData, setReturnData] = useState({ book_copy_id: '', user_id: '', transaction_id: '', returnDate: '', book_author: '', book_title: '' });
    const [userOptions, setUserOptions] = useState<{ id: number; firstName: string; lastName: string; email: string; role: string; }[]>([]);
    const [bookCopy, setBookCopy] = useState<{ id: number; barcode: string; book_id: number; }[]>([]);
    const [books, setBooks] = useState<{ id: number; title: string; author: string; }[]>([]);

    useEffect(() => {
        // Fetch users and books
        axios.get('/api/users').then(res => setUserOptions(res.data));
        // Fetch book copies
        axios.get('/api/book-copies').then(res => setBookCopy(res.data));

        axios.get('/api/books').then(res => setBooks(res.data));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setIssueData(prev => {
            const updated = { ...prev, [name]: value };

            if (name === 'book_copy_id') {
                const matchedBookCopy = bookCopy.find(book => book.id.toString() === value || book.barcode === value);
                if (matchedBookCopy) {
                    const matchedBook = books.find(
                        book => book.id === matchedBookCopy.book_id
                    );
                    if (matchedBook) {
                        updated.book_title = matchedBook.title;
                        updated.book_author = matchedBook.author || '';
                    }
                }
            }

            if (name === 'user_id') {
                const matchedUser = userOptions.find(user => user.id.toString() === value);
                if (matchedUser) {
                    updated.user_name = `${matchedUser.firstName} ${matchedUser.lastName}`;
                    updated.user_role = matchedUser.role;
                    updated.user_email = matchedUser.email;
                }
            }

            return updated;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/admin/issueReturn/issue-book', issueData);
            console.log(response.data.message);       // 👈 Shows: "Book issued successfully"
            console.log(response.data.transaction);   // 👈 Use this data in your UI
            // Trigger UI update, toast, or redirect here
        } catch (error: any) {
            console.error(error.response?.data || error.message);
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Issue Book', href: '/issue-book' }]}>
            <Head title="Issue Book" />
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
                    <h1 className="text-2xl font-bold mb-4">Issue Book</h1>
                    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
                        <h2 className="text-2xl font-bold mb-4">Issue Book</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* User ID Input */}
                            <label htmlFor="userid">User Id:
                            </label>
                            {/* 
                            {issueData.user_id && (
                                <div className="mb-2 text-sm text-gray-700">
                                    <strong>{issueData.user_name}</strong> ({issueData.user_email} | {issueData.user_role})
                                </div>
                            )} */}

                            <input
                                name="user_id"
                                value={issueData.user_id}
                                onChange={handleChange}
                                placeholder="Enter User ID"
                                className="w-full border rounded p-2"
                                required
                            />
                            <label htmlFor="userid">User Name:
                            </label>
                            <input
                                name="user_id"
                                value={issueData.user_name}
                                onChange={handleChange}
                                placeholder="Enter User Name"
                                className="w-full border rounded p-2"
                                required
                            />
                            <label htmlFor="userid">User Email:
                            </label>
                            <input
                                name="user_id"
                                value={issueData.user_email}
                                onChange={handleChange}
                                placeholder="Enter User Email"
                                className="w-full border rounded p-2"
                                required
                            />
                            <label htmlFor="userid">User Type:
                            </label>
                            <input
                                name="user_id"
                                value={issueData.user_role}
                                onChange={handleChange}
                                placeholder="Enter User Type"
                                className="w-full border rounded p-2"
                                required
                            />
                            {/* Book Copy ID Input */}
                            <label htmlFor="userid">Book Id:
                            </label>
                            <input
                                name="book_copy_id"
                                value={issueData.book_copy_id}
                                onChange={handleChange}
                                placeholder="Enter Book Copy ID or Barcode"
                                className="w-full border rounded p-2"
                                required
                            />
                            <label htmlFor="userid">Book Title:
                            </label>
                            <input
                                type="text"
                                name="book_title"
                                value={issueData.book_title}
                                onChange={handleChange}
                                placeholder="Enter Book Title"
                                className="w-full border rounded p-2"
                            />
                            <label htmlFor="userid">Book Author:
                            </label>
                            <input
                                type="text"
                                name="book_author"
                                value={issueData.book_author}
                                onChange={handleChange}
                                placeholder="Enter Book Author"
                                className="w-full border rounded p-2"
                            />
                            <label htmlFor="issueDate">Issue Date:</label>
                            <input
                                type="date"
                                name='issueDate'
                                value={issueData.issueDate}
                                onChange={handleChange}
                                className="w-full border rounded p-2"
                                required
                            />
                            <div className="flex gap-3 justify-end mt-4">
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                    Issue Book
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIssueData({
                                            book_copy_id: '',
                                            book_title: '',
                                            book_author: '',
                                            user_id: '',
                                            issueDate: today,
                                            user_name: '',
                                            user_email: '',
                                            user_role: '',
                                        });
                                    }}
                                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>

                </div>


            </div>
        </AppLayout>
    );
};

export default IssueBookIndex;
