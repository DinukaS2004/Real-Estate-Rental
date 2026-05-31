import Link from "next/link";
import { Building2 } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t bg-white">
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold">RentSphere</span>
                    </div>
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} RentSphere. All rights reserved.
                    </p>
                    <div className="flex gap-4 text-sm text-gray-500">
                        <Link href="#" className="hover:text-gray-900">Privacy</Link>
                        <Link href="#" className="hover:text-gray-900">Terms</Link>
                        <Link href="#" className="hover:text-gray-900">Contact</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}