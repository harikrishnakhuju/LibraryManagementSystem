import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// You can fetch or pass these from the server later
const mockStats = {
    totalBooks: 320,
    totalStudents: 120,
    totalStaff: 15,
    borrowedBooks: 48,
    overdueBooks: 6,
};

export default function Dashboard() { 
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <h1 className="text-2xl font-semibold mb-4">📚 Library Dashboard</h1>

                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <DashboardCard title="📘 Total Books" value={mockStats.totalBooks} link="/books" />
                    <DashboardCard title="👨‍🎓 Total Students" value={mockStats.totalStudents} link="/students" />
                    <DashboardCard title="👩‍🏫 Total Staff" value={mockStats.totalStaff} link="/staff" />
                    <DashboardCard title="📖 Borrowed Books" value={mockStats.borrowedBooks} link="/catalog/borrowed" />
                    <DashboardCard title="⏰ Overdue Books" value={mockStats.overdueBooks} link="/catalog/overdue" />
                    <QuickActionCard />
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

function DashboardCard({ title, value, link }: { title: string; value: number; link: string }) {
    return (
        <Link
            href={link}
            className="relative p-6 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border bg-white dark:bg-[#1f1f1f] hover:shadow-md transition"
        >
            <h3 className="text-lg font-medium">{title}</h3>
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
