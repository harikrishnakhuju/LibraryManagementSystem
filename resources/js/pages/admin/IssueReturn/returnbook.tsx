
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
        title: 'Issue/Return Book',
        href: '/admin/issueReturn',
    },
];
const ReturnBookIndex = ({ children }: { children: React.ReactNode }) => {

    const today = new Date().toISOString().split('T')[0];
    const location = typeof window !== 'undefined' ? window.location.pathname : '';
    const [issueData, setIssueData] = useState({
        book_copy_id: '',
        book_title: '',
        book_author: '',
        user_id: '',
        returnDate: today,
        user_name: '',
        user_role: '',
        user_email: '',
        is_damaged: false,
        is_lost: false,
        remarks: "",
        daysLate: 0,
        fee: 0,
        dueDate: '',
        isOverdue: false,

    });

    const [modalType, setModalType] = useState<'issue' | 'return' | null>(null);
    const [userOptions, setUserOptions] = useState<{ id: number; firstName: string; lastName: string; email: string; role: string; }[]>([]);
    const [bookCopy, setBookCopy] = useState<{ id: number; barcode: string; book_id: number; }[]>([]);
    const [books, setBooks] = useState<{ id: number; title: string; author: string; }[]>([]);
    const [latePreview, setLatePreview] = useState<{
        dueDate: string;
        late_fee: number;
        isOverdue: boolean;
        daysLate: number;
    } | null>(null);

    useEffect(() => {
        // Fetch users and books
        axios.get('/api/users').then(res => setUserOptions(res.data));
        // Fetch book copies
        axios.get('/api/book-copies').then(res => setBookCopy(res.data));

        axios.get('/api/books').then(res => setBooks(res.data));
    }, []);

    useEffect(() => {
        const { user_id, book_copy_id } = issueData;
        if (user_id && book_copy_id) {
            axios.get('/admin/issueReturn/preview-return', {
                params: { user_id, book_copy_id },
            })
                .then(res => setIssueData(prev => ({
                    ...prev,
                    dueDate: res.data.dueDate,
                    fee: res.data.late_fee,
                    daysLate: res.data.daysLate,
                    isOverdue: res.data.isOverdue,
                })))
                .catch(() => setLatePreview(null));
        } else {
            setLatePreview(null); // clear preview if inputs are empty
        }
    }, [issueData.user_id, issueData.book_copy_id]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setIssueData(prev => {
            const updated = {
                ...prev, [name]: type === 'checkbox' && e.target instanceof HTMLInputElement
                    ? e.target.checked
                    : value
            };

            if (name === 'book_copy_id') {
                // Find the matching book copy
                const matchedBookCopy = bookCopy.find(copy => copy.id.toString() === value || copy.barcode === value);

                // Use book_id from book copy to find the actual book
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
            const response = await axios.post('/admin/issueReturn/return-book', issueData);
            console.log(response.data.message);       // 👈 Shows: "Book issued successfully"
            console.log(response.data.transaction);   // 👈 Use this data in your UI
            // Trigger UI update, toast, or redirect here
        } catch (error: any) {
            console.error(error.response?.data || error.message);
        }
    };



    return (
        <AppLayout breadcrumbs={[{ title: 'Return Book', href: '/return-book' }]}>
            <Head title="Return Book" />
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

            <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg space-y-6 border">
    <h2 className="text-3xl font-semibold text-gray-800 mb-6">Return Book</h2>

    {/* User Info Section */}
    <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">User Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block mb-1 font-medium text-sm text-gray-700">User ID</label>
                <input
                    name="user_id"
                    value={issueData.user_id}
                    onChange={handleChange}
                    placeholder="Enter User ID"
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div>
                <label className="block mb-1 font-medium text-sm text-gray-700">Name</label>
                <input
                    name="user_id"
                    value={issueData.user_name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full border rounded-lg p-2 bg-gray-100"
                    readOnly
                />
            </div>
            <div>
                <label className="block mb-1 font-medium text-sm text-gray-700">Email</label>
                <input
                    name="user_id"
                    value={issueData.user_email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full border rounded-lg p-2 bg-gray-100"
                    readOnly
                />
            </div>
            <div>
                <label className="block mb-1 font-medium text-sm text-gray-700">Role</label>
                <input
                    name="user_id"
                    value={issueData.user_role}
                    onChange={handleChange}
                    placeholder="User Role"
                    className="w-full border rounded-lg p-2 bg-gray-100"
                    readOnly
                />
            </div>
        </div>
    </div>

    {/* Book Info Section */}
    <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Book Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block mb-1 font-medium text-sm text-gray-700">Book Copy ID</label>
                <input
                    name="book_copy_id"
                    value={issueData.book_copy_id}
                    onChange={handleChange}
                    placeholder="Enter Book Copy ID"
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>
            <div>
                <label className="block mb-1 font-medium text-sm text-gray-700">Title</label>
                <input
                    name="book_title"
                    value={issueData.book_title}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 bg-gray-100"
                    readOnly
                />
            </div>
            <div>
                <label className="block mb-1 font-medium text-sm text-gray-700">Author</label>
                <input
                    name="book_author"
                    value={issueData.book_author}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 bg-gray-100"
                    readOnly
                />
            </div>
        </div>
    </div>

    {/* Return Info Section */}
    <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Return Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block mb-1 font-medium text-sm text-gray-700">Return Date</label>
                <input
                    type="date"
                    name="returnDate"
                    value={issueData.returnDate}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2"
                    required
                />
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    name="is_damaged"
                    checked={issueData.is_damaged}
                    onChange={handleChange}
                />
                <label htmlFor="is_damaged" className="text-sm text-gray-700">Damaged</label>
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    name="is_lost"
                    checked={issueData.is_lost}
                    onChange={handleChange}
                />
                <label htmlFor="is_lost" className="text-sm text-gray-700">Lost</label>
            </div>
            <div>
                <label className="block mb-1 font-medium text-sm text-gray-700">Days Late</label>
                <input
                    type="number"
                    name="days_late"
                    value={issueData.daysLate}
                    readOnly
                    className="w-full border rounded-lg p-2 bg-gray-100"
                />
            </div>
            <div>
                <label className="block mb-1 font-medium text-sm text-gray-700">Late Fee (₹)</label>
                <input
                    type="number"
                    name="late_fee"
                    value={issueData.fee}
                    readOnly
                    className="w-full border rounded-lg p-2 bg-gray-100"
                />
            </div>
        </div>
        <div className="mt-4">
            <label className="block mb-1 font-medium text-sm text-gray-700">Remarks</label>
            <textarea
                name="remarks"
                value={issueData.remarks}
                onChange={handleChange}
                rows={3}
                className="w-full border rounded-lg p-2"
            />
        </div>
    </div>

    {/* Action Buttons */}
    <div className="flex justify-end gap-4 mt-6">
        <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
            Return Book
        </button>
        <button
            type="button"
            onClick={() =>
                setIssueData({
                    book_copy_id: '',
                    book_title: '',
                    book_author: '',
                    user_id: '',
                    returnDate: today,
                    user_name: '',
                    user_email: '',
                    user_role: '',
                    is_damaged: false,
                    is_lost: false,
                    remarks: '',
                    daysLate: 0,
                    fee: 0,
                    isOverdue: false,
                    dueDate: '',
                })
            }
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
        >
            Cancel
        </button>
    </div>
</div>

                </div>


        </AppLayout>
    );
};

export default ReturnBookIndex;