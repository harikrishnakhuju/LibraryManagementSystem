
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
        href: '/admin/issueReturn',
    },
];
const ReturnBookIndex = ({ children }: { children: React.ReactNode }) => {
    const location = typeof window !== 'undefined' ? window.location.pathname : '';

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

                <div className="p-4">
                    <h1 className="text-2xl font-bold mb-4">Return Book</h1>

                </div>
            </div>

        </AppLayout>
    );
};

export default ReturnBookIndex;


// //Pop up modal state
// const [modalType, setModalType] = useState<'issue' | 'return' | null>(null);
// const [issueData, setIssueData] = useState({ book_copy_id: '', book_author: '', book_title: '', user_id: '', issueDate: '', dueDate: '', user_name: '' });
// const [returnData, setReturnData] = useState({ book_copy_id: '', user_id: '', transaction_id: '', returnDate: '', book_author: '', book_title: '' });
// const [userOptions, setUserOptions] = useState<{ id: number; firstName: string; lastName: string }[]>([]);
// const [bookOptions, setBookOptions] = useState<{ id: number; title: string; author: string; barcode: string }[]>([]);

// const handleIssueBook = async () => {
//     // try {
//     await axios.post('/book/issue', issueData);
//     handleCloseModal();
//     // } 
//     // catch (err) {
//     //     console.error('Issue error:', err.response?.data || err.message);
//     // }
// };

// const handleReturnBook = async () => {
//     // try {
//     await axios.post('/book/return', returnData);
//     handleCloseModal();
//     // }
//     //  catch (err:unknown) {
//     //     console.error('Return error:', err.response?.data || err.message);
//     // }
// };

// const handleIssueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setIssueData(prev => {
//         const updated = { ...prev, [name]: value }
//         if (name === 'book_copy_id') {
//             const matchedBook = bookOptions.find(book => book.id.toString() === value || book.barcode === value);
//             if (matchedBook) {
//                 updated.book_title = matchedBook.title;
//                 updated.book_author = matchedBook.author || '';
//             } else {
//                 updated.book_title = '';
//                 updated.book_author = '';
//             }
//         }

//         // Autofill user name if user_id is typed or selected
//         if (name === 'user_id') {
//             const matchedUser = userOptions.find(user => user.id.toString() === value);
//             if (matchedUser) {
//                 updated.user_name = `${matchedUser.firstName} ${matchedUser.lastName}`;
//             } else {
//                 updated.user_name = '';
//             }
//         }
//         return updated;

//     });
// };




// const handleReturnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setReturnData(prev => ({ ...prev, [name]: value }));
// };

// const [isModalOpen, setIsModalOpen] = useState(false);

// const handleCloseModal = () => {
//     setIsModalOpen(false);
// };


// {modalType === 'issue' && (
//     <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
//         <div className="bg-white p-6 rounded-lg w-[90%] md:w-[700px] shadow-lg relative">
//             <h2 className="text-xl font-semibold mb-4 capitalize">Issue Book</h2>
//             <form
//                 onSubmit={e => { e.preventDefault(); handleIssueBook(); }}
//                 className="space-y-3"
//             >
//                 <select name="user_id" value={issueData.user_id} onChange={handleIssueChange} className="w-full border rounded p-2" required>
//                     <option value="">Select User</option>
//                     {userOptions.map(user => (
//                         <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>
//                     ))}
//                 </select>

//                 <select name="book_copy_id" value={issueData.book_copy_id} onChange={handleIssueChange} className="w-full border rounded p-2" required>
//                     <option value="">Select Book</option>
//                     {bookOptions.map(book => (
//                         <option key={book.id} value={book.id}>{book.title} — {book.barcode}</option>
//                     ))}
//                 </select>

//                 <div className="flex justify-end gap-2">
//                     <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
//                     <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Issue</button>
//                 </div>
//             </form>
//         </div>
//     </div>
// )}

// {modalType === 'return' && (
//     <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
//         <div className="bg-white p-6 rounded-lg w-[90%] md:w-[700px] shadow-lg relative">
//             <h2 className="text-xl font-semibold mb-4 capitalize">Return Book</h2>
//             <form
//                 onSubmit={e => { e.preventDefault(); handleReturnBook(); }}
//                 className="space-y-3"
//             >
//                 <input
//                     name="book_copy_id"
//                     value={returnData.book_copy_id}
//                     onChange={handleReturnChange}
//                     placeholder="Enter Book Copy ID or Barcode"
//                     className="w-full border rounded p-2"
//                     required
//                 />

//                 <input
//                     name="user_id"
//                     value={returnData.user_id}
//                     onChange={handleReturnChange}
//                     placeholder="Enter User ID"
//                     className="w-full border rounded p-2"
//                     required
//                 />

//                 <div className="flex justify-end gap-2">
//                     <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
//                     <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Return</button>
//                 </div>
//             </form>
//         </div>
//     </div>
// )}

