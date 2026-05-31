"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PropertyCard from "@/components/property/PropertyCard";
import { useGetPropertiesQuery } from "@/lib/api/propertiesApi";

export default function HomeContent() {
    const router = useRouter();
    const [searchCity, setSearchCity] = useState("");

    const { data, isLoading } = useGetPropertiesQuery({});

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchCity.trim()) {
            router.push(`/search?city=${encodeURIComponent(searchCity.trim())}`);
        } else {
            router.push("/search");
        }
    };

    return (
        <div>
            {/* Hero */}
            <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
                            Find your perfect rental home
                        </h1>
                        <p className="text-blue-100 text-lg mb-8">
                            Browse thousands of properties and connect directly with landlords.
                        </p>

                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative flex-1">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search by city..."
                                    className="pl-10 h-12 bg-white text-gray-900 border-0"
                                    value={searchCity}
                                    onChange={(e) => setSearchCity(e.target.value)}
                                />
                            </div>
                            <Button
                                type="submit"
                                size="lg"
                                className="h-12 bg-white text-blue-700 hover:bg-blue-50 font-medium"
                            >
                                <Search className="h-4 w-4 mr-2" />
                                Search
                            </Button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Search,
                                title: "Smart search",
                                desc: "Filter by price, size, amenities, and location to find exactly what you need.",
                            },
                            {
                                icon: Zap,
                                title: "Apply instantly",
                                desc: "Submit rental applications online and track their status in real time.",
                            },
                            {
                                icon: Shield,
                                title: "Secure platform",
                                desc: "Verified landlords and secure payments protect every transaction.",
                            },
                        ].map(({ icon: Icon, title, desc }) => (
                            <div key={title} className="text-center p-6">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
                                    <Icon className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                                <p className="text-gray-600 text-sm">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured listings */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Featured properties
                        </h2>
                        <Button variant="outline" onClick={() => router.push("/search")}>
                            View all
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-80 bg-gray-100 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data?.data.slice(0, 6).map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
