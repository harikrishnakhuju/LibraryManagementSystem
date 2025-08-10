import React, { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import axios from 'axios';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { BookOpen, Clock } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import { cn } from '@/lib/utils';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { router } from '@inertiajs/react';


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
        
        toast.success('✅ Book issued successfully!', {
            autoClose: 1500,
            onClose: () => {
                // Redirect after toast closes
                router.visit('/admin/issueReturn/issue-book');
            }
        });

        // Optional: Reset the form
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

    } catch (error: any) {
        console.error(error.response?.data || error.message);
        toast.error('❌ Failed to issue book.');
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
<div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-md border">
    <h2 className="text-2xl font-semibold text-gray-800 mb-6">📚 Issue a Book</h2>

    <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Details */}
        <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">👤 User Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">User ID</label>
                    <input
                        type="text"
                        name="user_id"
                        value={issueData.user_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter user ID"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">User Name</label>
                    <input
                        type="text"
                        name="user_name"
                        value={issueData.user_name}
                        disabled
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-700"
                        placeholder="Auto-filled"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                    <input
                        type="text"
                        name="user_email"
                        value={issueData.user_email}
                        disabled
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-700"
                        placeholder="Auto-filled"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">User Role</label>
                    <input
                        type="text"
                        name="user_role"
                        value={issueData.user_role}
                        disabled
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-700"
                        placeholder="Auto-filled"
                    />
                </div>
            </div>
        </div>

        {/* Book Details */}
        <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">📖 Book Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Book Copy ID / Barcode</label>
                    <input
                        name="book_copy_id"
                        value={issueData.book_copy_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter barcode or ID"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Book Title</label>
                    <input
                        name="book_title"
                        value={issueData.book_title}
                        disabled
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-700"
                        placeholder="Auto-filled"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Book Author</label>
                    <input
                        name="book_author"
                        value={issueData.book_author}
                        disabled
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-gray-700"
                        placeholder="Auto-filled"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Issue Date</label>
                    <input
                        type="date"
                        name="issueDate"
                        value={issueData.issueDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
            </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t">
            <button
                type="button"
                onClick={() =>
                    setIssueData({
                        book_copy_id: '',
                        book_title: '',
                        book_author: '',
                        user_id: '',
                        issueDate: today,
                        user_name: '',
                        user_email: '',
                        user_role: '',
                    })
                }
                className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300"
            >
                Cancel
            </button>
            <button
                type="submit"
                className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
                Issue Book
            </button>
        </div>
    </form>
</div>


                </div>


        </AppLayout>
    );
};

export default IssueBookIndex;
