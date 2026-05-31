"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DashboardNavbar() {
    const { user, signOut, isManager } = useAuth();

    return (
        <header className="h-14 border-b bg-white flex items-center
                       justify-between px-6">
            <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-900">
          {user?.name || "Loading..."}
        </span>
                <Badge variant={isManager ? "default" : "secondary"}>
                    {isManager ? "Manager" : "Tenant"}
                </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={() => signOut()}>
                Sign out
            </Button>
        </header>
    );
}