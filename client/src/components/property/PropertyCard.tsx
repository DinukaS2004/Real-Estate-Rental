"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Heart } from "lucide-react";
import type { Property } from "@/lib/api/propertiesApi";

interface PropertyCardProps {
    property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
    const primaryPhoto =
        property.photoUrls[0] ||
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800";

    return (
        <Link href={`/properties/${property.id}`}>
            <div className="group bg-white rounded-xl border hover:shadow-md transition-shadow overflow-hidden">

                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                    <Image
                        src={primaryPhoto}
                        alt={property.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <button
                        className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow
                       hover:scale-110 transition-transform"
                        onClick={(e) => e.preventDefault()}
                    >
                        <Heart className="h-4 w-4 text-gray-400" />
                    </button>
                    {property.isPetsAllowed && (
                        <Badge className="absolute bottom-3 left-3 bg-white text-gray-700">
                            Pets OK
                        </Badge>
                    )}
                </div>

                {/* Details */}
                <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-gray-900 truncate pr-2">
                            {property.name}
                        </h3>
                        <span className="font-semibold text-blue-600 whitespace-nowrap">
              ${property.pricePerMonth.toLocaleString()}
                            <span className="text-xs font-normal text-gray-500">/mo</span>
            </span>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">
              {property.location.city}, {property.location.state}
            </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Bed className="h-3.5 w-3.5" />
                {property.beds} {property.beds === 1 ? "bed" : "beds"}
            </span>
                        <span className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5" />
                            {property.baths} {property.baths === 1 ? "bath" : "baths"}
            </span>
                        {property.squareFeet && (
                            <span className="text-gray-400">
                {property.squareFeet.toLocaleString()} sqft
              </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}