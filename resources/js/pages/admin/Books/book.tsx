import { router } from '@inertiajs/react';
import React, { useEffect, useState, useRef, DragEvent } from 'react';
import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Upload, Pencil, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Book', href: '/admin/books' },
];

type Book = {
    id: number;
    isbn: string;
    title: string;
    author: string;
    category: string;
    edition: string;
    noOfCopy?: number;
    price: number;
    publisher_id?: number;
    published_year?: string;
};

type ModalType = 'edit' | 'delete' | 'csv' | null;

const BookIndex = () => {
    const [bookList, setBookList] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalType, setModalType] = useState<ModalType>(null);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [formData, setFormData] = useState<Omit<Book, 'id'>>({
        isbn: '',
        title: '',
        author: '',
        category: '',
        edition: '',
        noOfCopy: 1,
        price: 0,
        publisher_id: 0,
        published_year: '',
    });
    const [csvError, setCsvError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);

    // Fetch books from API endpoint
    const fetchBooks = () => {
        setLoading(true);
        axios.get<Book[]>('/admin/books/list')
            .then(res => {
                setBookList(Array.isArray(res.data) ? res.data : []);
                setLoading(false);
            })
            .catch(() => {
                setBookList([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        if (modalType === 'edit' && selectedBook) {
            const { isbn, title, author, category, edition, noOfCopy, price, publisher_id, published_year } = selectedBook;
            setFormData({ isbn, title, author, category, edition, noOfCopy, price, publisher_id, published_year });
        }
    }, [modalType, selectedBook]);

    const handleEditBook = async () => {
        if (!selectedBook) return;
        try {
            const res = await axios.put(`/admin/books/${selectedBook.id}`, formData);
            setBookList(prev =>
                Array.isArray(prev)
                    ? prev.map(b => (b.id === res.data.id ? res.data : b))
                    : []
            );
            handleCloseModal();
            router.visit('/admin/books');
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteBook = async (id: number) => {
        try {
            await axios.delete(`/admin/books/${id}`);
            setBookList(prev =>
                Array.isArray(prev)
                    ? prev.filter(book => book.id !== id)
                    : []
            );
            handleCloseModal();
            router.visit('/admin/books');
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpenModal = (type: ModalType, book?: Book) => {
        setSelectedBook(book || null);
        setModalType(type);
        setCsvError(null);
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedBook(null);
        setFormData({
            isbn: '',
            title: '',
            author: '',
            category: '',
            edition: '',
            noOfCopy: 1,
            price: 0,
            publisher_id: 0,
            published_year: '',
        });
        setCsvError(null);
        setDragActive(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]:
                name === 'price' || name === 'noOfCopy' || name === 'publisher_id'
                    ? value === '' ? undefined : Number(value)
                    : value,
        }));
    };

    // CSV Upload Handler
    const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setCsvError(null);
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target?.result as string;
            const rows = text.split('\n').map(row => row.trim()).filter(Boolean);
            if (rows.length < 2) {
                setCsvError('CSV must have a header and at least one data row.');
                return;
            }
            const header = rows[0].split(',').map(h => h.trim());
            // Accept all possible columns, but only use those present in $fillable
            const allowed = [
                'isbn', 'title', 'author', 'category', 'edition',
                'noOfCopy', 'price', 'publisher_id', 'published_year'
            ];
            const headerLower = header.map(h => h.toLowerCase());
            const required = ['isbn', 'title', 'author', 'category', 'edition', 'price'];
            if (!required.every(r => headerLower.includes(r.toLowerCase()))) {
                setCsvError('CSV header must include: ' + required.join(', '));
                return;
            }
            const validRows = [];
            for (let i = 1; i < rows.length; i++) {
                const cols = rows[i].split(',').map(c => c.trim());
                if (cols.length !== header.length) continue;
                const book: any = {};
                header.forEach((h, idx) => {
                    if (allowed.includes(h)) {
                        book[h] = cols[idx];
                    }
                });
                // Check for complete required data
                if (required.every(r => book[r] && book[r] !== '')) {
                    validRows.push({
                        isbn: book['isbn'],
                        title: book['title'],
                        author: book['author'],
                        category: book['category'],
                        edition: book['edition'],
                        noOfCopy: book['noOfCopy'] ? Number(book['noOfCopy']) : 1,
                        price: parseFloat(book['price']),
                        publisher_id: book['publisher_id'] ? Number(book['publisher_id']) : undefined,
                        published_year: book['published_year'] || '',
                    });
                }
            }
            if (validRows.length === 0) {
                setCsvError('No valid rows found. All rows missing required fields were skipped.');
                return;
            }
            try {
                const res = await axios.post('/admin/books/bulk', { books: validRows });
                setBookList(prev =>
                    Array.isArray(prev)
                        ? [...prev, ...(Array.isArray(res.data) ? res.data : [])]
                        : (Array.isArray(res.data) ? res.data : [])
                );
                handleCloseModal();
            } catch (err: any) {
                if (err.response && err.response.data && err.response.data.errors) {
                    const errors = err.response.data.errors;
                    setCsvError(Object.values(errors).flat().join(' '));
                } else if (err.response && err.response.data && err.response.data.message) {
                    setCsvError(err.response.data.message);
                } else {
                    setCsvError('Failed to upload books. Please check your CSV and try again.');
                }
            }
        };
        reader.readAsText(file);
    };

    // Drag and drop handlers for CSV modal
    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleCsvUpload({ target: { files: e.dataTransfer.files } } as any);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Book" />
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Books</h1>
                    <button
                        onClick={() => handleOpenModal('csv')}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        <Upload size={16} /> Import CSV
                    </button>
                </div>

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
                                <th className="p-2 border">No. of Copy</th>
                                <th className="p-2 border">Price</th>
                                <th className="p-2 border">Published Year</th>
                                <th className="p-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(bookList) && bookList.length > 0 ? (
                                bookList.map((book) => (
                                    <tr key={book.id} className="text-center">
                                        <td className="p-2 border">{book.isbn}</td>
                                        <td className="p-2 border">{book.title}</td>
                                        <td className="p-2 border">{book.author}</td>
                                        <td className="p-2 border">{book.category}</td>
                                        <td className="p-2 border">{book.edition}</td>
                                        <td className="p-2 border">{book.noOfCopy ?? ''}</td>
                                        <td className="p-2 border">Rs. {book.price}</td>
                                        <td className="p-2 border">{book.publisher_id ?? ''}</td>
                                        <td className="p-2 border">{book.published_year ?? ''}</td>
                                        <td className="p-2 border">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => handleOpenModal('edit', book)}>
                                                    <Pencil size={18} className="text-blue-500 hover:text-blue-700" />
                                                </button>
                                                <button onClick={() => handleOpenModal('delete', book)}>
                                                    <Trash2 size={18} className="text-red-500 hover:text-red-700" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={10} className="text-center p-4 text-gray-400">No books found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}

                {/* === Modal Popup === */}
                {modalType && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg w-[90%] md:w-[700px] shadow-lg relative">
                            {modalType === 'edit' && selectedBook && (
                                <>
                                    <h2 className="text-xl font-semibold mb-4 capitalize">Edit Book</h2>
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleEditBook();
                                        }}
                                        className="space-y-3"
                                    >
                                        <input name="isbn" value={formData.isbn} onChange={handleChange} placeholder="ISBN" className="w-full border rounded p-2" required />
                                        <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full border rounded p-2" required />
                                        <input name="author" value={formData.author} onChange={handleChange} placeholder="Author" className="w-full border rounded p-2" required />
                                        <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="w-full border rounded p-2" required />
                                        <input name="edition" value={formData.edition} onChange={handleChange} placeholder="Edition" className="w-full border rounded p-2" required />
                                        <input type="number" name="noOfCopy" value={formData.noOfCopy} onChange={handleChange} placeholder="No. of Copy" className="w-full border rounded p-2" />
                                        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="w-full border rounded p-2" required />
                                        <input type="number" name="publisher_id" value={formData.publisher_id} onChange={handleChange} placeholder="Publisher ID" className="w-full border rounded p-2" />
                                        <input name="published_year" value={formData.published_year} onChange={handleChange} placeholder="Published Year" className="w-full border rounded p-2" />
                                        <div className="flex justify-end gap-2">
                                            <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Update</button>
                                        </div>
                                    </form>
                                </>
                            )}

                            {modalType === 'delete' && selectedBook && (
                                <>
                                    <h2 className="text-xl font-semibold mb-4">Delete Book</h2>
                                    <p>Are you sure you want to delete <strong>{selectedBook.title}</strong>?</p>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <button
                                            onClick={handleCloseModal}
                                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleDeleteBook(selectedBook.id)}
                                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}

                            {modalType === 'csv' && (
                                <>
                                    <h2 className="text-xl font-semibold mb-4">Import Books from CSV</h2>
                                    <div
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={`mb-4 border-2 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors
                                            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-300 bg-gray-50'}
                                        `}
                                        onClick={() => fileInputRef.current?.click()}
                                        style={{ minHeight: 120 }}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".csv"
                                            onChange={handleCsvUpload}
                                            className="hidden"
                                        />
                                        <Upload size={32} className="mb-2 text-gray-400" />
                                        <span className="text-gray-600 text-sm">
                                            Drag &amp; drop your CSV file here, or <span className="underline text-blue-600 cursor-pointer">browse</span>
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">
                                        CSV columns: isbn, title, author, category, edition, noOfCopy, price, publisher_id, published_year (required: isbn, title, author, category, edition, price)
                                    </p>
                                    {csvError && (
                                        <div className="text-red-600 text-sm mb-2">{csvError}</div>
                                    )}
                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleCloseModal}
                                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </>
                            )}

                            <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-black"
                                onClick={handleCloseModal}
                            >
                                ✖
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default BookIndex;
