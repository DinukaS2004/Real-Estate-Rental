"use client";

import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

export default function Navbar() {
    const { isAuthenticated, isLoading, signIn, signOut, user, isManager } =
        useAuth();

    return (
        <nav className="border-b bg-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Building2 className="h-6 w-6 text-blue-600" />
                        <span className="font-semibold text-lg">RentSphere</span>
                    </Link>

                    {/* Nav links */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href="/search"
                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Browse Properties
                        </Link>
                        {isAuthenticated && (
                            <Link
                                href={isManager ? "/managers/properties" : "/tenants/applications"}
                                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Dashboard
                            </Link>
                        )}
                    </div>

                    {/* Auth buttons */}
                    <div className="flex items-center gap-3">
                        {isLoading ? (
                            <div className="h-8 w-20 bg-gray-100 animate-pulse rounded" />
                        ) : isAuthenticated ? (
                            <>
                <span className="text-sm text-gray-600 hidden md:block">
                  {user?.name}
                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => signOut()}
                                >
                                    Sign out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => signIn()}
                                >
                                    Sign in
                                </Button>
                                <Button size="sm" onClick={() => signIn()}>
                                    Get started
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}