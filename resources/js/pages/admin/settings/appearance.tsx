import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import {usePage} from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';


export default function Appearance() {
    const { props } = usePage();
    const guard = props.guard ?? 'web';
    const isAdmin = guard === 'admin';
    
    const breadcrumbs: BreadcrumbItem[] = isAdmin ? [
        {
            title: 'Appearance settings',
            href: '/admin/settings/appearance',
        },
    ]:
    [
        {
            title: 'Appearance settings',
            href: '/settings/appearance',
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Appearance settings" description="Update your account's appearance settings" />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
