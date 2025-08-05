import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { useEffect, useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'AdminDashboard',
        href: '/admin/dashboard',
    },
];

export default function Dashboard() {
    const pieChartRef = useRef<HTMLCanvasElement>(null);
    const lineChartRef = useRef<HTMLCanvasElement>(null)
    const pieChartInstance = useRef<any>(null); // For pie chart
    const lineChartInstance = useRef<any>(null); // For line chart

    const [stats, setStats] = useState({
        totalBooks: 0,
        totalUsers: 0,
        borrowedBooks: 0,
        returnedBooks: 0,
        overdueBooks: 0,
        monthlyActivity: {
            labels: [],
            borrowed: [],
            returned: [],
        },
    });

    useEffect(() => {
        fetch('/admin/dashboard-stats')
            .then(res => res.json())
            .then(data => {
                setStats(data);
            });
    }, []);

    useEffect(() => {
        import('chart.js/auto').then((Chart) => {
            // // Destroy previous pie chart if exists
            if (pieChartInstance.current) {
                pieChartInstance.current.destroy();
            }
            // Pie Chart: Borrowed vs Returned
            if (pieChartRef.current) {
                pieChartInstance.current = new Chart.default(pieChartRef.current, {
                    type: 'pie',
                    data: {
                        labels: ['Borrowed Books', 'Returned Books'],
                        datasets: [
                            {
                                data: [stats.borrowedBooks, stats.returnedBooks],
                                backgroundColor: ['#2563eb', '#f59e42'],
                                borderColor: ['#fff', '#fff'],
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
                                    color: '#1e293b',
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
            if (lineChartRef.current) {
                lineChartInstance.current = new Chart.default(lineChartRef.current, {
                    type: 'line',
                    data: {
                        labels: stats.monthlyActivity.labels,
                        datasets: [
                            {
                                label: 'Borrowed',
                                data: stats.monthlyActivity.borrowed,
                                borderColor: '#2563eb',
                                backgroundColor: 'rgba(37,99,235,0.08)',
                                tension: 0.4,
                                fill: true,
                                pointRadius: 4,
                                pointBackgroundColor: '#2563eb',
                            },
                            {
                                label: 'Returned',
                                data: stats.monthlyActivity.returned,
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
    }, [stats]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-8 bg-neutral-50 dark:bg-[#101014] overflow-x-auto">
                <h1 className="text-3xl font-bold mb-6 text-blue-900 dark:text-orange-300 tracking-tight">📚 Library Admin Dashboard</h1>

                {/* Stats Cards */}
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
                    <DashboardCard
                        title="Total Books"
                        value={stats.totalBooks}
                        link="/admin/books"
                        color="from-blue-700 to-blue-400"
                        icon="📘"
                    />
                    <DashboardCard
                        title="Total Users"
                        value={stats.totalUsers}
                        link="/admin/users"
                        color="from-green-700 to-green-400"
                        icon="👥"
                    />
                    <DashboardCard
                        title="Borrowed Books"
                        value={stats.borrowedBooks}
                        link="/admin/catalog/borrowed-books"
                        color="from-slate-800 to-blue-600"
                        icon="📖"
                    />
                    <DashboardCard
                        title="Overdue Books"
                        value={stats.overdueBooks}
                        link="/admin/catalog/overdue-borrowers"
                        color="from-red-700 to-red-400"
                        icon="⏰"
                    />
                </div>

                {/* Charts Section */}
                <div className="flex flex-col md:flex-row gap-8 mt-6 min-h-[400px]">
                    {/* Line Chart */}
                    <div className="flex-1 bg-white dark:bg-[#18181b] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow p-8 flex flex-col justify-center">
                        <h2 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-neutral-200">📈 Monthly Book Transactions</h2>
                        <canvas ref={lineChartRef} height={280} />
                    </div>
                    {/* Pie Chart */}
                    <div className="w-full md:w-1/3 bg-white dark:bg-[#18181b] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow p-8 flex flex-col items-center justify-center">
                        <h2 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-neutral-200">📊 Borrowed vs Returned</h2>
                        <canvas ref={pieChartRef} width={260} height={260} />
                    </div>
                </div>

                {/* Optional larger section or chart */}
                <div className="relative min-h-[30vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border p-6 bg-white dark:bg-[#1f1f1f]">
                    <h2 className="text-lg font-semibold mb-4">📊 Overview</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Track your library performance, manage your catalog, and monitor overdue records from this dashboard.
                    </p>
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
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
    icon,
}: {
    title: string;
    value: number;
    link: string;
    color: string;
    icon: string;
}) {
    return (
        <Link
            href={link}
            className={`relative p-8 rounded-xl bg-gradient-to-br ${color} text-white shadow-lg hover:scale-105 transition-transform duration-200 flex flex-col items-start`}
        >
            <span className="text-3xl mb-2">{icon}</span>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-3xl font-bold mt-2">{value}</p>
        </Link>
    );
}

function QuickActionCard() {
    return (
        <div className="relative p-6 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-[#1f1f1f]">
            <h3 className="text-lg font-medium mb-2">⚡ Quick Actions</h3>
            <ul className="space-y-2">
                <li>
                    <Link href="/books/create" className="text-blue-600 hover:underline">
                        ➕ Add New Book
                    </Link>
                </li>
                <li>
                    <Link href="/students" className="text-blue-600 hover:underline">
                        👥 View Students
                    </Link>
                </li>
                <li>
                    <Link href="/catalog/borrowed" className="text-blue-600 hover:underline">
                        📚 View Borrowed Books
                    </Link>
                </li>
            </ul>
        </div>
    );
}

