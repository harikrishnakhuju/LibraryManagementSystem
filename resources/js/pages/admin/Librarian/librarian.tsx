import React, { useEffect, useState, useRef, DragEvent } from 'react';
import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

type adminUser = {
    id: number;
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    address: string;
    phone: string;
    role: string;
};

type ModalType = 'add' | 'edit' | 'csv' | null;

const UserIndex = () => {
    const [users, setUsers] = useState<adminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalType, setModalType] = useState<ModalType>(null);
    const [selectedUser, setSelectedUser] = useState<adminUser | null>(null);
    const [formData, setFormData] = useState<Omit<adminUser, 'id'> & { password?: string }>({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        address: '',
        phone: '',
        role: 'librarian',
        password: '',
    });
    const [csvError, setCsvError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);

    // Fetch users
    const fetchUsers = () => {
        setLoading(true);
        axios.get<adminUser[]>('/admin/adminUsers/list')
            .then(res => setUsers(res.data))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchUsers(); }, []);

    useEffect(() => {
        if (modalType === 'edit' && selectedUser) {
            const { firstName, middleName, lastName, email, address, phone, role } = selectedUser;
            setFormData({ firstName, middleName: middleName || '', lastName, email, address, phone, role, password: '' });
        }

        if (modalType === 'add') {
            setFormData({
                firstName: '',
                middleName: '',
                lastName: '',
                email: '',
                address: '',
                phone: '',
                role: 'librarian',
                password: '',
            });
        }

    }, [modalType, selectedUser]);

    const handleAddUser = async () => {
        const data = { ...formData };
        if (!data.password) delete data.password;
        const res = await axios.post('/admin/adminUsers', data);
        console.log('User added:', res.data);
        fetchUsers();
        handleCloseModal();
    };

    const handleEditUser = async () => {
        if (!selectedUser) return;
        const data = { ...formData };
        if (!data.password) delete data.password;
        await axios.put(`/admin/adminUsers/${selectedUser.id}`, data);
        fetchUsers();
        handleCloseModal();
    };

    const handleOpenModal = (type: ModalType, user?: adminUser) => {
        setSelectedUser(user || null);
        setModalType(type);
        setCsvError(null);
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedUser(null);
        setFormData({
            firstName: '', middleName: '', lastName: '', email: '', address: '',
            phone: '', role: 'librarian', password: '',
        });
        setCsvError(null);
        setDragActive(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
            const allowed = [
                'firstName', 'middleName', 'lastName', 'email', 'address', 'phone', 'role', 'password'
            ];
            const headerLower = header.map(h => h.toLowerCase());
            const required = ['firstName', 'lastName', 'email', 'address', 'phone', 'role', 'password'];
            if (!required.every(r => headerLower.includes(r.toLowerCase()))) {
                setCsvError('CSV header must include: ' + required.join(', '));
                return;
            }
            const validRows = [];
            for (let i = 1; i < rows.length; i++) {
                const cols = rows[i].split(',').map(c => c.trim());
                if (cols.length !== header.length) continue;
                const user: any = {};
                header.forEach((h, idx) => {
                    if (allowed.includes(h)) {
                        user[h] = cols[idx];
                    }
                });
                if (required.every(r => user[r] && user[r] !== '')) {
                    validRows.push({
                        firstName: user['firstName'],
                        middleName: user['middleName'] || '',
                        lastName: user['lastName'],
                        email: user['email'],
                        address: user['address'],
                        phone: user['phone'],
                        role: user['role'],
                        password: user['password'],
                    });
                }
            }
            if (validRows.length === 0) {
                setCsvError('No valid rows found. All rows missing required fields were skipped.');
                return;
            }
            try {
                await axios.post('/admin/adminUsers/bulk', { users: validRows });
                fetchUsers();
                handleCloseModal();
            } catch (err: any) {
                if (err.response && err.response.data && err.response.data.errors) {
                    const errors = err.response.data.errors;
                    setCsvError(Object.values(errors).flat().join(' '));
                } else if (err.response && err.response.data && err.response.data.message) {
                    setCsvError(err.response.data.message);
                } else {
                    setCsvError('Failed to upload users. Please check your CSV and try again.');
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

    const handleDeleteUser = async (id: number) => {
        await axios.delete(`/admin/adminUsers/${id}`);
        fetchUsers();
    };

    return (
        <AppLayout>
            <Head title="Users" />
            <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">AdminUser</h1>
                    <button
                        onClick={() => handleOpenModal('csv')}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Import CSV
                    </button>
                    <button
                        onClick={() => handleOpenModal('add')}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Add Admin/Librarian
                    </button>
                </div>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="table-auto w-full border">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-2 border">First Name</th>
                                <th className="p-2 border">Middle Name</th>
                                <th className="p-2 border">Last Name</th>
                                <th className="p-2 border">Email</th>
                                <th className="p-2 border">Address</th>
                                <th className="p-2 border">Phone</th>
                                <th className="p-2 border">Role</th>
                                <th className="p-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="text-center">
                                    <td className="p-2 border">{user.firstName}</td>
                                    <td className="p-2 border">{user.middleName}</td>
                                    <td className="p-2 border">{user.lastName}</td>
                                    <td className="p-2 border">{user.email}</td>
                                    <td className="p-2 border">{user.address}</td>
                                    <td className="p-2 border">{user.phone}</td>
                                    <td className="p-2 border">{user.role}</td>
                                    <td className="p-2 border">
                                        <button
                                            onClick={() => handleOpenModal('edit', user)}
                                            className="text-blue-600 mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="text-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* === Modal Popup === */}
                {modalType && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg w-[90%] md:w-[700px] shadow-lg relative">
                            {modalType === 'add' && (
                                <>
                                    <h2 className="text-xl font-semibold mb-4 capitalize">Add Admin/Librarian</h2>
                                    <form
                                        onSubmit={e => { e.preventDefault(); handleAddUser(); }}
                                        className="space-y-3"
                                    >
                                        <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="w-full border rounded p-2" required />
                                        <input name="middleName" value={formData.middleName} onChange={handleChange} placeholder="Middle Name" className="w-full border rounded p-2" />
                                        <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="w-full border rounded p-2" required />
                                        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full border rounded p-2" required />
                                        <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full border rounded p-2" required />
                                        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full border rounded p-2" required />
                                        <select name="role" value={formData.role} onChange={handleChange} className="w-full border rounded p-2" required>
                                            <option value="student">Student</option>
                                            <option value="staff">Staff</option>
                                        </select>
                                        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full border rounded p-2" required />
                                        <div className="flex justify-end gap-2">
                                            <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                                            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Add</button>
                                        </div>
                                    </form>
                                </>
                            )}

                            {modalType === 'edit' && selectedUser && (
                                <>
                                    <h2 className="text-xl font-semibold mb-4 capitalize">Edit Admin/Librarian</h2>
                                    <form
                                        onSubmit={e => { e.preventDefault(); handleEditUser(); }}
                                        className="space-y-3"
                                    >
                                        <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="w-full border rounded p-2" required />
                                        <input name="middleName" value={formData.middleName} onChange={handleChange} placeholder="Middle Name" className="w-full border rounded p-2" />
                                        <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="w-full border rounded p-2" required />
                                        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full border rounded p-2" required />
                                        <input name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="w-full border rounded p-2" required />
                                        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full border rounded p-2" required />
                                        <select name="role" value={formData.role} onChange={handleChange} className="w-full border rounded p-2" required>
                                            <option value="student">Student</option>
                                            <option value="staff">Staff</option>
                                        </select>
                                        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="New Password (optional)" className="w-full border rounded p-2" />
                                        <div className="flex justify-end gap-2">
                                            <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Update</button>
                                        </div>
                                    </form>
                                </>
                            )}

                            {modalType === 'csv' && (
                                <>
                                    <h2 className="text-xl font-semibold mb-4">Import Admin/Librarian from CSV</h2>
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
                                        <span className="text-gray-600 text-sm">
                                            Drag &amp; drop your CSV file here, or <span className="underline text-blue-600 cursor-pointer">browse</span>
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">
                                        CSV columns: firstName, middleName, lastName, email, address, phone, role, password (required: firstName, lastName, email, address, phone, role, password)
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

export default UserIndex;