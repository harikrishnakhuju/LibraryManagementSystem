import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpenIcon, HomeIcon } from 'lucide-react';

// Default nav items
const defaultNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon
  },
  {
    title: 'Books',
    href: '/books',
    icon: BookOpenIcon
  }
];

export function NavMain({ items = defaultNavItems }: { items?: NavItem[] }) {
  const { url } = usePage();

  return (
    <SidebarGroup className="px-2 py-0">
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={url.startsWith(item.href)}
              tooltip={{ children: item.title }}
            >
              <Link href={item.href} prefetch className="flex items-center gap-2">
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
