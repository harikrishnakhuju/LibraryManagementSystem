import { useEffect, useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

type BorrowedBook = {
    transaction_id: number;
    book_title: string;
    dueDate: string; // or reserveDate if that's what your backend sends
};

type ReturnedBook = {
    transaction_id: number;
    book_title: string;
    returnedDate: string; // or reserveDate if that's what your backend sends
};

type OverdueBook = {
    transaction_id: number;
    book_title: string;
    dueDate: string; // or reserveDate if that's what your backend sends
};

export default function Dashboard() {
    const pieChartRef = useRef<HTMLCanvasElement>(null);
    const lineChartRef = useRef<HTMLCanvasElement>(null);
    const pieChartInstance = useRef<any>(null); // For pie chart
    const lineChartInstance = useRef<any>(null); // For line chart


    const [stats, setStats] = useState({
        borrowedBooks: 0,
        returnedBooks: 0,
        overdueBooks: 0,
    });

    const [borrowedBooksList, setBorrowedBooksList] = useState<BorrowedBook[]>([]);
    const [returnedBooksList, setReturnedBooksList] = useState<ReturnedBook[]>([]);
    const [overdueBooksList, setOverdueBooksList] = useState<OverdueBook[]>([]);
    const [monthlyActivity, setMonthlyActivity] = useState({
        labels: [],
        borrowed: [],
        returned: [],
    });

    useEffect(() => {
        fetch('/user/dashboard-stats')
            .then(res => res.json())
            .then(data => {
                console.log('Dashboard stats:', data)
                setStats({
                    borrowedBooks: data.borrowedBooksCount ?? 0,
                    returnedBooks: data.returnedBooksCount ?? 0,
                    overdueBooks: data.overdueBooksCount ?? 0,
                });
                setBorrowedBooksList(data.borrowedBooksList || []);
                setReturnedBooksList(data.returnedBooksList || []);
                setOverdueBooksList(data.overdueBooksList || []);
                setMonthlyActivity(data.monthlyActivity || { labels: [], borrowed: [], returned: [] });
            });
    }, []);


    const [showBorrowed, setShowBorrowed] = useState(false);
    const [showReturned, setShowReturned] = useState(false);
    const [showOverdue, setShowOverdue] = useState(false);

    useEffect(() => {
        import('chart.js/auto').then((Chart) => {
            // // Destroy previous pie chart if exists
            if (pieChartInstance.current) {
                pieChartInstance.current.destroy();
            }
            // Pie Chart
            if (pieChartRef.current) {
                pieChartInstance.current = new Chart.default(pieChartRef.current, {
                    type: 'pie',
                    data: {
                        labels: ['Borrowed Books', 'Returned Books', 'Overdue Books'],
                        datasets: [
                            {
                                data: [
                                    stats.borrowedBooks,
                                    stats.returnedBooks,
                                    stats.overdueBooks,
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

            // Destroy previous line chart if exists
            if (lineChartInstance.current) {
                lineChartInstance.current.destroy();
            }
            // Line Chart (only borrowed and returned)
            if (lineChartRef.current) {
                lineChartInstance.current = new Chart.default(lineChartRef.current, {
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
                        aspectRatio: 2.5,
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
                                ticks: { color: '#64748b', font: { family: 'Inter, sans-serif' }, stepSize: 1 },
                                grid: { color: '#e5e7eb' },
                            },
                        },
                    },
                });
            }
        });
    }, [monthlyActivity]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-8 bg-neutral-50 dark:bg-[#101014] overflow-x-auto">
                <h1 className="text-2xl md:text-3xl font-bold mb-4 text-neutral-900 dark:text-neutral-100 tracking-tight">
                    User Dashboard
                </h1>

                {/* Stats Cards */}
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                    <DashboardCard title="Borrowed Books" value={stats.borrowedBooks} link="/catalog/borrowed-books" color="from-slate-800 to-blue-600" />
                    <DashboardCard title="Returned Books" value={stats.returnedBooks} link="/catalog/returned-books" color="from-orange-600 to-yellow-400" />
                    <DashboardCard title="Overdue Books" value={stats.overdueBooks} link="/catalog/overdue-borrowers" color="from-red-700 to-red-400" />
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
                            count={stats.borrowedBooks}
                            show={showBorrowed}
                            setShow={setShowBorrowed}
                            color="blue"
                            items={borrowedBooksList.map(book => ({
                                id: book.transaction_id,
                                label: book.book_title,
                                meta: `Due: ${book.dueDate}`,
                            }))}
                        />
                        {/* Returned Books Toggle */}
                        <DropdownList
                            title="Returned Books"
                            count={stats.returnedBooks}
                            show={showReturned}
                            setShow={setShowReturned}
                            color="orange"
                            items={returnedBooksList.map(book => ({
                                id: book.transaction_id,
                                label: book.book_title,
                                meta: `Returned: ${book.returnedDate}`,
                            }))}
                        />
                        {/* Overdue Books Toggle */}
                        <DropdownList
                            title="Overdue Books"
                            count={stats.overdueBooks}
                            show={showOverdue}
                            setShow={setShowOverdue}
                            color="red"
                            items={overdueBooksList.map(book => ({
                                id: book.transaction_id,
                                label: book.book_title,
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
