import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

type User = { id: number; email: string; firstName: string; lastName: string; };

const EventPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selected, setSelected] = useState<number[]>([]);
    const [message, setMessage] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<string | null>(null);

    useEffect(() => {
        axios.get('/admin/users/list').then(res => setUsers(res.data));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('message', message);
        selected.forEach(id => formData.append('user_ids[]', String(id)));
        if (file) formData.append('file', file);

        try {
            await axios.post('/admin/events/notify', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setStatus('Notification sent!');
        } catch {
            setStatus('Failed to send notification.');
        }
    };

    return (
        <AppLayout>
            <Head title="Send Notification" />
            <div className="p-4 max-w-xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Send Notification</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-semibold">Select Users</label>
                        <select multiple className="w-full border rounded p-2" value={selected.map(String)} onChange={e => {
                            const options = Array.from(e.target.selectedOptions).map(o => Number(o.value));
                            setSelected(options);
                        }}>
                            {users.map(u => (
                                <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.email})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold">Message</label>
                        <textarea className="w-full border rounded p-2" value={message} onChange={e => setMessage(e.target.value)} required />
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold">Attach File (optional)</label>
                        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
                    {status && <div className="mt-2">{status}</div>}
                </form>
            </div>
        </AppLayout>
    );
};

export default EventPage;