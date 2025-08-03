import { useEffect, useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

const mockStats = {
    borrowedBooks: 5,
    returnedBooks: 272,
    overdueBooks: 2,
};

const borrowedBooksList = [
    { id: 1, title: 'The Great Gatsby', dueDate: '2025-08-10' },
    { id: 2, title: '1984', dueDate: '2025-08-12' },
    // ...add more as needed
];

const returnedBooksList = [
    { id: 1, title: 'To Kill a Mockingbird', returnedDate: '2025-08-01' },
    { id: 2, title: 'Moby Dick', returnedDate: '2025-08-02' },
    // ...add more as needed
];

const overdueBooksList = [
    { id: 1, title: 'Pride and Prejudice', dueDate: '2025-07-30' },
    { id: 2, title: 'Hamlet', dueDate: '2025-07-28' },
    // ...add more as needed
];

// Only borrowed and returned for user activity
const monthlyActivity = {
    labels: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    borrowed: [2, 5, 8, 6, 7, 10, 12, 9, 8, 7, 6, 5],
    returned: [1, 4, 7, 5, 6, 9, 11, 8, 7, 6, 5, 4],
};

export default function Dashboard() {
    const pieChartRef = useRef<HTMLCanvasElement>(null);
    const lineChartRef = useRef<HTMLCanvasElement>(null);

    const [showBorrowed, setShowBorrowed] = useState(false);
    const [showReturned, setShowReturned] = useState(false);
    const [showOverdue, setShowOverdue] = useState(false);

    useEffect(() => {
        import('chart.js/auto').then((Chart) => {
            // Pie Chart
            if (pieChartRef.current) {
                new Chart.default(pieChartRef.current, {
                    type: 'pie',
                    data: {
                        labels: ['Borrowed Books', 'Returned Books', 'Overdue Books'],
                        datasets: [
                            {
                                data: [
                                    mockStats.borrowedBooks,
                                    mockStats.returnedBooks,
                                    mockStats.overdueBooks,
                                ],
                                backgroundColor: [
                                    '#1e293b', // dark blue
                                    '#f59e42', // orange
                                    '#dc2626', // red
                                ],
                                borderColor: [
                                    '#fff',
                                    '#fff',
                                    '#fff',
                                ],
                                borderWidth: 2,
                            },
                        ],
                    },
                    options: {
                        plugins: {
                            legend: {
                                display: true,
                                position: 'bottom',
                                labels: {
                                    color: '#334155',
                                    font: { size: 15, weight: 'bold', family: 'Inter, sans-serif' },
                                },
                            },
                            tooltip: {
                                backgroundColor: '#1e293b',
                                titleColor: '#fbbf24',
                                bodyColor: '#fff',
                                borderColor: '#f59e42',
                                borderWidth: 2,
                            },
                        },
                    },
                });
            }
            // Line Chart (only borrowed and returned)
            if (lineChartRef.current) {
                new Chart.default(lineChartRef.current, {
                    type: 'line',
                    data: {
                        labels: monthlyActivity.labels,
                        datasets: [
                            {
                                label: 'Borrowed',
                                data: monthlyActivity.borrowed,
                                borderColor: '#2563eb',
                                backgroundColor: 'rgba(37,99,235,0.08)',
                                tension: 0.4,
                                fill: true,
                                pointRadius: 4,
                                pointBackgroundColor: '#2563eb',
                            },
                            {
                                label: 'Returned',
                                data: monthlyActivity.returned,
                                borderColor: '#f59e42',
                                backgroundColor: 'rgba(245,158,66,0.08)',
                                tension: 0.4,
                                fill: true,
                                pointRadius: 4,
                                pointBackgroundColor: '#f59e42',
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                display: true,
                                position: 'top',
                                labels: {
                                    color: '#334155',
                                    font: { size: 14, weight: 'bold', family: 'Inter, sans-serif' },
                                },
                            },
                            tooltip: {
                                backgroundColor: '#1e293b',
                                titleColor: '#fbbf24',
                                bodyColor: '#fff',
                                borderColor: '#f59e42',
                                borderWidth: 2,
                            },
                        },
                        scales: {
                            x: {
                                ticks: { color: '#64748b', font: { family: 'Inter, sans-serif' } },
                                grid: { color: '#e5e7eb' },
                            },
                            y: {
                                beginAtZero: true,
                                ticks: { color: '#64748b', font: { family: 'Inter, sans-serif' } },
                                grid: { color: '#e5e7eb' },
                            },
                        },
                    },
                });
            }
        });
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-8 bg-neutral-50 dark:bg-[#101014] overflow-x-auto">
                <h1 className="text-2xl md:text-3xl font-bold mb-4 text-neutral-900 dark:text-neutral-100 tracking-tight">
                    User Dashboard
                </h1>

                {/* Stats Cards */}
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                    <DashboardCard title="Borrowed Books" value={mockStats.borrowedBooks} link="/catalog/borrowed" color="from-slate-800 to-blue-600" />
                    <DashboardCard title="Returned Books" value={mockStats.returnedBooks} link="/catalog/returned" color="from-orange-600 to-yellow-400" />
                    <DashboardCard title="Overdue Books" value={mockStats.overdueBooks} link="/catalog/overdue" color="from-red-700 to-red-400" />
                </div>

                {/* Main Content: 3/4 Line Graph, 1/4 Pie + Dropdowns */}
                <div className="flex flex-row gap-8 mt-4 min-h-[400px]">
                    {/* 3/4 width: User Activity Line Graph */}
                    <div className="flex-1 basis-3/4 bg-white dark:bg-[#18181b] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow p-8 flex flex-col justify-center">
                        <h2 className="text-lg font-semibold mb-auto text-neutral-800 dark:text-neutral-200">Monthly Book Transactions</h2>
                        <canvas ref={lineChartRef} height={300} className='mb-20' />
                    </div>
                    {/* 1/4 width: Pie Chart and Dropdowns */}
                    <div className="flex flex-col gap-6 basis-1/4 min-w-[320px]">
                        <div className="bg-white dark:bg-[#18181b] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow p-6 flex flex-col items-center">
                            <h2 className="text-base font-semibold mb-3 text-neutral-800 dark:text-neutral-200">Book Status</h2>
                            <canvas ref={pieChartRef} width={200} height={200} />
                        </div>
                        {/* Borrowed Books Toggle */}
                        <DropdownList
                            title="Borrowed Books"
                            count={mockStats.borrowedBooks}
                            show={showBorrowed}
                            setShow={setShowBorrowed}
                            color="blue"
                            items={borrowedBooksList.map(book => ({
                                id: book.id,
                                label: book.title,
                                meta: `Due: ${book.dueDate}`,
                            }))}
                        />
                        {/* Returned Books Toggle */}
                        <DropdownList
                            title="Returned Books"
                            count={mockStats.returnedBooks}
                            show={showReturned}
                            setShow={setShowReturned}
                            color="orange"
                            items={returnedBooksList.map(book => ({
                                id: book.id,
                                label: book.title,
                                meta: `Returned: ${book.returnedDate}`,
                            }))}
                        />
                        {/* Overdue Books Toggle */}
                        <DropdownList
                            title="Overdue Books"
                            count={mockStats.overdueBooks}
                            show={showOverdue}
                            setShow={setShowOverdue}
                            color="red"
                            items={overdueBooksList.map(book => ({
                                id: book.id,
                                label: book.title,
                                meta: `Due: ${book.dueDate}`,
                            }))}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function DashboardCard({
    title,
    value,
    link,
    color,
}: {
    title: string;
    value: number;
    link: string;
    color: string;
}) {
    return (
        <Link
            href={link}
            className={`relative p-6 rounded-xl bg-gradient-to-br ${color} text-white shadow hover:scale-[1.03] transition-transform duration-150 flex flex-col items-start border border-neutral-200 dark:border-neutral-800`}
        >
            <h3 className="text-base font-semibold">{title}</h3>
            <p className="text-3xl font-bold mt-2">{value}</p>
        </Link>
    );
}

function DropdownList({
    title,
    count,
    show,
    setShow,
    color,
    items,
}: {
    title: string;
    count: number;
    show: boolean;
    setShow: (v: boolean) => void;
    color: 'blue' | 'orange' | 'red';
    items: { id: number; label: string; meta: string }[];
}) {
    const colorMap = {
        blue: 'text-blue-700 dark:text-blue-300',
        orange: 'text-orange-700 dark:text-orange-300',
        red: 'text-red-700 dark:text-red-300',
    };
    const borderMap = {
        blue: 'border-blue-200 dark:border-blue-700',
        orange: 'border-orange-200 dark:border-orange-700',
        red: 'border-red-200 dark:border-red-700',
    };
    return (
        <div className={`bg-white dark:bg-[#18181b] rounded-xl border ${borderMap[color]} shadow p-4`}>
            <button
                className={`w-full flex justify-between items-center text-sm font-semibold ${colorMap[color]} focus:outline-none`}
                onClick={() => setShow(!show)}
            >
                <span>{title} <span className="font-normal text-neutral-500 dark:text-neutral-400">({count})</span></span>
                <span>{show ? '▲' : '▼'}</span>
            </button>
            {show && (
                <ul className="mt-3 divide-y divide-neutral-100 dark:divide-neutral-700">
                    {items.map(item => (
                        <li key={item.id} className="py-2 text-sm">
                            <span className="font-medium">{item.label}</span>
                            <span className="text-neutral-500 dark:text-neutral-400 block">{item.meta}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}