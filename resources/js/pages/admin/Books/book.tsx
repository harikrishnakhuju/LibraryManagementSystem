import { usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

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
    price: number;
};
type Props = {
    books: Book[];
};
type ModalType = 'add' | 'edit' | 'delete' | null;

const BookIndex = () => {

    const { books } = usePage<Props>().props;
    const [bookList, setBookList] = useState<Book[]>(books || []);
    const [loading, setLoading] = useState(true);
    const [modalType, setModalType] = useState<ModalType>(null);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [formData, setFormData] = useState<Omit<Book, 'id'>>({
        isbn: '',
        title: '',
        author: '',
        category: '',
        edition: '',
        price: 0,
    });

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        if (modalType === 'edit' && selectedBook) {
            const { isbn, title, author, category, edition, price } = selectedBook;
            setFormData({ isbn, title, author, category, edition, price });
        } else if (modalType === 'add') {
            setFormData({
                isbn: '',
                title: '',
                author: '',
                category: '',
                edition: '',
                price: 0,
            });
        }
    }, [modalType, selectedBook]);

    const fetchBooks = () => {
        axios.get<Book[]>('/admin/books')
            .then(res => {
                setBookList(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const handleAddBook = async () => {
        try {
            const res = await axios.post('/admin/books', formData);
            setBookList([...books, res.data]);
            handleCloseModal();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditBook = async () => {
        if (!selectedBook) return;
        try {
            const res = await axios.put(`/admin/books/${selectedBook.id}`, formData);
            setBookList(bookList.map(b => (b.id === res.data.id ? res.data : b)));
            handleCloseModal();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteBook = async (id: number) => {
        try {
            await axios.delete(`/admin/books/${id}`);
            setBookList(books.filter(book => book.id !== id));
            handleCloseModal();
        } catch (err) {
            console.error(err);
        }
    };

    const handleOpenModal = (type: ModalType, book?: Book) => {
        setSelectedBook(book || null);
        setModalType(type);
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedBook(null);
        setFormData({ isbn: '', title: '', author: '', category: '', edition: '', price: 0 });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) : value,
        }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Book" />
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Books</h1>
                    <button
                        onClick={() => handleOpenModal('add')}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        <Plus size={16} /> Add Book
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
                                <th className="p-2 border">Price</th>
                                <th className="p-2 border">Actions</th>
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
                            ))}
                        </tbody>
                    </table>
                )}

                {/* === Modal Popup === */}
                {modalType && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg w-[90%] md:w-[500px] shadow-lg relative">
                            <h2 className="text-xl font-semibold mb-4 capitalize">{modalType} Book</h2>

                            {(modalType === 'add' || modalType === 'edit') && (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        modalType === 'add' ? handleAddBook() : handleEditBook();
                                    }}
                                    className="space-y-3"
                                >
                                    <input name="isbn" value={formData.isbn} onChange={handleChange} placeholder="ISBN" className="w-full border rounded p-2" required />
                                    <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full border rounded p-2" required />
                                    <input name="author" value={formData.author} onChange={handleChange} placeholder="Author" className="w-full border rounded p-2" required />
                                    <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="w-full border rounded p-2" required />
                                    <input name="edition" value={formData.edition} onChange={handleChange} placeholder="Edition" className="w-full border rounded p-2" required />
                                    <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" className="w-full border rounded p-2" required />
                                    <div className="flex justify-end gap-2">
                                        <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{modalType === 'add' ? 'Add' : 'Update'}</button>
                                    </div>
                                </form>
                            )}

                            {modalType === 'delete' && selectedBook && (
                                <>
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
