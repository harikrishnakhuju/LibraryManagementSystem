import React from 'react';
import { Link } from '@inertiajs/react';
import { BookOpen, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';

const tabs = [
  {
    name: 'Borrowed Books',
    href: '/catalog/borrowed-books',
    icon: BookOpen,
  },
  {
    name: 'Overdue Borrowers',
    href: '/catalog/overdue-borrowers',
    icon: Clock,
  },
];

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Catalog',
    href: '/catalog',
  },
];

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  const location = typeof window !== 'undefined' ? window.location.pathname : '';

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Catalog" />
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

        {/* Page Content */}
        <div className="bg-white shadow p-4 rounded-md">borrowed</div>
      </div>
    </AppLayout>
  );
}
