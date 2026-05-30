import { PrismaClient, UserRole, PropertyType, AmenityType, ApplicationStatus } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, ".env") });

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
    console.log("Seeding database...");

    // ── Locations ──────────────────────────────────────────
    const location1 = await prisma.location.create({
        data: {
            address: "123 Main Street",
            city: "Austin",
            state: "TX",
            country: "USA",
            postalCode: "78701",
            latitude: 30.2672,
            longitude: -97.7431,
        },
    });

    const location2 = await prisma.location.create({
        data: {
            address: "456 Oak Avenue",
            city: "Austin",
            state: "TX",
            country: "USA",
            postalCode: "78702",
            latitude: 30.2711,
            longitude: -97.7381,
        },
    });

    // ── Manager user ───────────────────────────────────────
    const managerUser = await prisma.user.create({
        data: {
            asgardeoId: "mock-asgardeo-manager-001",
            email: "manager@test.com",
            name: "Sarah Johnson",
            phoneNumber: "+1-512-555-0100",
            role: UserRole.MANAGER,
            manager: {
                create: {
                    companyName: "Johnson Properties LLC",
                    bio: "Managing Austin rentals since 2015",
                },
            },
        },
        include: { manager: true },
    });

    // ── Tenant user ────────────────────────────────────────
    const tenantUser = await prisma.user.create({
        data: {
            asgardeoId: "mock-asgardeo-tenant-001",
            email: "tenant@test.com",
            name: "Alex Rivera",
            phoneNumber: "+1-512-555-0200",
            role: UserRole.TENANT,
            tenant: { create: {} },
        },
        include: { tenant: true },
    });

    // ── Properties ─────────────────────────────────────────
    const property1 = await prisma.property.create({
        data: {
            name: "Modern Downtown Apartment",
            description: "Bright 2-bedroom apartment in the heart of Austin. Walking distance to restaurants, shops, and public transit.",
            pricePerMonth: 1850,
            securityDeposit: 1850,
            applicationFee: 50,
            photoUrls: [
                "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
            ],
            isPetsAllowed: true,
            isParkingIncluded: false,
            beds: 2,
            baths: 1,
            squareFeet: 920,
            propertyType: PropertyType.APARTMENT,
            isAvailable: true,
            managerId: managerUser.manager!.id,
            locationId: location1.id,
            amenities: {
                create: [
                    { type: AmenityType.WIFI },
                    { type: AmenityType.LAUNDRY },
                    { type: AmenityType.AIR_CONDITIONING },
                ],
            },
        },
    });

    const property2 = await prisma.property.create({
        data: {
            name: "Cozy East Austin Studio",
            description: "Stylish studio in the vibrant East Austin neighborhood. Perfect for young professionals.",
            pricePerMonth: 1250,
            securityDeposit: 1250,
            applicationFee: 35,
            photoUrls: [
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
            ],
            isPetsAllowed: false,
            isParkingIncluded: true,
            beds: 1,
            baths: 1,
            squareFeet: 480,
            propertyType: PropertyType.STUDIO,
            isAvailable: true,
            managerId: managerUser.manager!.id,
            locationId: location2.id,
            amenities: {
                create: [
                    { type: AmenityType.WIFI },
                    { type: AmenityType.PARKING },
                    { type: AmenityType.GYM },
                ],
            },
        },
    });

    console.log("Created properties:", property1.name, property2.name);
    console.log("Created users:", managerUser.name, tenantUser.name);
    console.log("Seeding complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });