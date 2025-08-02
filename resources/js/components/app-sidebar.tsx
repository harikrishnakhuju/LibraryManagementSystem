import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage} from '@inertiajs/react';
import {LayoutDashboard, BookOpen, Folder, LayoutGrid, Clock } from 'lucide-react';
import AppLogo from './app-logo';

// const mainNavItems: NavItem[] = [
//     {
//         title: 'Dashboard',
//         href: '/dashboard',
//         icon: LayoutGrid,
//     },
//     {
//         title: 'Books',
//         href: '/books',
//         icon: Folder,
//     },
//     //    {
//     //     title: 'Borrowed Books',
//     //     href: '/catalog/borrowed-books',
//     //     icon: BookOpen,
//     // },
//     // {
//     //     title: 'Overdue Borrowers',
//     //     href: '/catalog/overdue-borrowers',
//     //     icon: Clock,
//     // },
// ];




export function AppSidebar() {
    const { props } = usePage();
    const guard = props.guard ?? 'web';
    const isAdmin = guard === 'admin';

    console.log("Guard value:", props.guard); // should log 'admin' when admin is logged in

    const mainNavItems: NavItem[] = isAdmin ?
        [
            { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
            { title: 'Books', href: '/admin/books', icon: Folder },
        ]
        :
        [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: LayoutDashboard,
            },
            {
                title: 'Books',
                href: '/books',
                icon: BookOpen,
            },
            {
                title: 'Catalog',
                href: '/catalog/borrowed-books',
                icon: Clock,
            },
        ];


    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={isAdmin ? '/admin/dashboard' : '/dashboard'} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
