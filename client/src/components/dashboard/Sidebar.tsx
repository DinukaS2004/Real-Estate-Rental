"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
    Building2, Heart, FileText,
    Home, LayoutDashboard, Settings,
} from "lucide-react";

const tenantLinks = [
    { href: "/tenants/applications", label: "Applications", icon: FileText },
    { href: "/tenants/favorites", label: "Favorites", icon: Heart },
    { href: "/tenants/residences", label: "My Residences", icon: Home },
];

const managerLinks = [
    { href: "/managers/properties", label: "My Properties", icon: Building2 },
    { href: "/managers/applications", label: "Applications", icon: FileText },
    { href: "/managers/leases", label: "Leases", icon: LayoutDashboard },
];

export default function Sidebar() {
    const { isManager } = useAuth();
    const pathname = usePathname();
    const links = isManager ? managerLinks : tenantLinks;

    return (
        <aside className="w-64 min-h-screen bg-white border-r flex flex-col">
            <div className="p-6 border-b">
                <Link href="/" className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">RentSphere</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {links.map(({ href, label, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                            pathname === href
                                ? "bg-blue-50 text-blue-700 font-medium"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <Icon className="h-4 w-4" />
                        {label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                     text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    <Settings className="h-4 w-4" />
                    Settings
                </Link>
            </div>
        </aside>
    );
}