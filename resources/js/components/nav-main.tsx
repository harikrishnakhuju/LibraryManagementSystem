import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
  BookOpen,
  FileText,
  Clock,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils"; 
import { useState } from 'react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
 const [isCatalogOpen, setIsCatalogOpen] = useState(true); // dropdown open by default

  const isActive = (path: string) => page.url.startsWith(path);//   const { url } = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={page.url.startsWith(item.href)} tooltip={{ children: item.title }}>
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
      {/* Other Links */}

         <aside className="w-64 shadow-md px-2 space-y-2">
      {/* Catalog Dropdown */}
      <div>
        <button
          className="flex items-center justify-between w-full text-left font-light rounded hover:bg-gray-100"
          onClick={() => setIsCatalogOpen(!isCatalogOpen)}
        >
          <span className="flex items-center gap-2 ">
            <BookOpen className="w-5 h-5" />
            Catalog
          </span>
          {isCatalogOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isCatalogOpen && (
          <div className="ml-6 mt-1 space-y-1">
            <Link
              href="/catalog/borrowed-books"
              className={cn(
                "flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100",
                isActive("/catalog/borrowed-books") && "bg-gray-200 font-sm text-blue-600"
              )}
            >
              <FileText className="w-4 h-4" />
              Borrowed Books
            </Link>
            <Link
              href="/catalog/overdue-borrowers"
              className={cn(
                "flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100",
                isActive("/catalog/overdue-borrowers") && "bg-gray-200 font-sm text-red-600"
              )}
            >
              <Clock className="w-4 h-4" />
              Overdue Borrowers
            </Link>
          </div>
        )}
      </div>
    </aside>

            </SidebarMenu>  
        </SidebarGroup>
    );
}