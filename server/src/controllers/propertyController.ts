import { Request, Response, NextFunction } from "express";
import prisma from "../utils/prisma";
import { createError } from "../middleware/errorHandler";

// GET /api/v1/properties
export const getProperties = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {
            city,
            minPrice,
            maxPrice,
            beds,
            baths,
            propertyType,
            isPetsAllowed,
            isParkingIncluded,
        } = req.query;

        const filters: any = { isAvailable: true };

        if (propertyType) filters.propertyType = propertyType;
        if (isPetsAllowed === "true") filters.isPetsAllowed = true;
        if (isParkingIncluded === "true") filters.isParkingIncluded = true;
        if (minPrice || maxPrice) {
            filters.pricePerMonth = {};
            if (minPrice) filters.pricePerMonth.gte = parseFloat(minPrice as string);
            if (maxPrice) filters.pricePerMonth.lte = parseFloat(maxPrice as string);
        }
        if (beds) filters.beds = { gte: parseInt(beds as string) };
        if (baths) filters.baths = { gte: parseFloat(baths as string) };

        const properties = await prisma.property.findMany({
            where: {
                ...filters,
                ...(city ? { location: { city: { contains: city as string, mode: "insensitive" } } } : {}),
            },
            include: {
                location: true,
                amenities: true,
                manager: { include: { user: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        res.json({ data: properties, count: properties.length });
    } catch (err) {
        next(err);
    }
};

// GET /api/v1/properties/:id
export const getPropertyById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const property = await prisma.property.findUnique({
            where: { id: req.params.id },
            include: {
                location: true,
                amenities: true,
                manager: { include: { user: true } },
                reviews: true,
            },
        });

        if (!property) return next(createError("Property not found", 404));

        res.json({ data: property });
    } catch (err) {
        next(err);
    }
};

// POST /api/v1/properties
export const createProperty = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const manager = await prisma.manager.findFirst({
            where: { user: { asgardeoId: req.user!.asgardeoId } },
        });

        if (!manager) return next(createError("Manager profile not found", 404));

        const {
            name, description, pricePerMonth, securityDeposit,
            applicationFee, isPetsAllowed, isParkingIncluded,
            beds, baths, squareFeet, propertyType, photoUrls,
            amenities, address, city, state, country, postalCode,
            latitude, longitude,
        } = req.body;

        const property = await prisma.property.create({
            data: {
                name,
                description,
                pricePerMonth: parseFloat(pricePerMonth),
                securityDeposit: parseFloat(securityDeposit),
                applicationFee: parseFloat(applicationFee || 0),
                isPetsAllowed: isPetsAllowed || false,
                isParkingIncluded: isParkingIncluded || false,
                beds: parseInt(beds),
                baths: parseFloat(baths),
                squareFeet: squareFeet ? parseInt(squareFeet) : null,
                propertyType,
                photoUrls: photoUrls || [],
                managerId: manager.id,
                location: {
                    create: { address, city, state, country, postalCode, latitude, longitude },
                },
                amenities: {
                    create: amenities?.map((type: string) => ({ type })) || [],
                },
            },
            include: { location: true, amenities: true },
        });

        res.status(201).json({ data: property });
    } catch (err) {
        next(err);
    }
};

// PUT /api/v1/properties/:id
export const updateProperty = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const property = await prisma.property.findUnique({
            where: { id: req.params.id },
            include: { manager: { include: { user: true } } },
        });

        if (!property) return next(createError("Property not found", 404));

        // Only the owning manager can update
        if (property.manager.user.asgardeoId !== req.user!.asgardeoId) {
            return next(createError("Not authorized to update this property", 403));
        }

        const updated = await prisma.property.update({
            where: { id: req.params.id },
            data: req.body,
            include: { location: true, amenities: true },
        });

        res.json({ data: updated });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/v1/properties/:id
export const deleteProperty = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const property = await prisma.property.findUnique({
            where: { id: req.params.id },
            include: { manager: { include: { user: true } } },
        });

        if (!property) return next(createError("Property not found", 404));

        if (property.manager.user.asgardeoId !== req.user!.asgardeoId) {
            return next(createError("Not authorized to delete this property", 403));
        }

        await prisma.property.delete({ where: { id: req.params.id } });

        res.json({ message: "Property deleted successfully" });
    } catch (err) {
        next(err);
    }
};