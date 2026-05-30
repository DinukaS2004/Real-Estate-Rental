import { Request, Response, NextFunction } from "express";
import prisma from "../utils/prisma";
import { createError } from "../middleware/errorHandler";

// POST /api/v1/applications
export const submitApplication = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const tenant = await prisma.tenant.findFirst({
            where: { user: { asgardeoId: req.user!.asgardeoId } },
        });

        if (!tenant) return next(createError("Tenant profile not found", 404));

        const { propertyId, message, moveInDate, name, email, phoneNumber } = req.body;

        // Check property exists and is available
        const property = await prisma.property.findUnique({
            where: { id: propertyId },
        });
        if (!property) return next(createError("Property not found", 404));
        if (!property.isAvailable) return next(createError("Property is not available", 400));

        // Check tenant doesn't already have a pending application for this property
        const existing = await prisma.application.findFirst({
            where: { tenantId: tenant.id, propertyId, status: "PENDING" },
        });
        if (existing) return next(createError("You already have a pending application for this property", 400));

        const application = await prisma.application.create({
            data: {
                tenantId: tenant.id,
                propertyId,
                name,
                email,
                phoneNumber,
                message,
                moveInDate: moveInDate ? new Date(moveInDate) : null,
                status: "PENDING",
            },
            include: { property: { include: { location: true } } },
        });

        res.status(201).json({ data: application });
    } catch (err) {
        next(err);
    }
};

// GET /api/v1/applications
export const getApplications = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { role, asgardeoId } = req.user!;

        if (role === "TENANT") {
            const tenant = await prisma.tenant.findFirst({
                where: { user: { asgardeoId } },
            });
            if (!tenant) return next(createError("Tenant not found", 404));

            const applications = await prisma.application.findMany({
                where: { tenantId: tenant.id },
                include: { property: { include: { location: true } }, lease: true },
                orderBy: { applicationDate: "desc" },
            });
            return res.json({ data: applications });
        }

        if (role === "MANAGER") {
            const manager = await prisma.manager.findFirst({
                where: { user: { asgardeoId } },
            });
            if (!manager) return next(createError("Manager not found", 404));

            const applications = await prisma.application.findMany({
                where: { property: { managerId: manager.id } },
                include: {
                    property: { include: { location: true } },
                    tenant: { include: { user: true } },
                    lease: true,
                },
                orderBy: { applicationDate: "desc" },
            });
            return res.json({ data: applications });
        }
    } catch (err) {
        next(err);
    }
};

// PUT /api/v1/applications/:id/status
export const updateApplicationStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        const application = await prisma.application.findUnique({
            where: { id },
            include: { property: { include: { manager: { include: { user: true } } } } },
        });

        if (!application) return next(createError("Application not found", 404));

        // Only the property's manager can update status
        if (application.property.manager.user.asgardeoId !== req.user!.asgardeoId) {
            return next(createError("Not authorized", 403));
        }

        const updated = await prisma.application.update({
            where: { id },
            data: { status },
        });

        // Auto-create lease when approved
        if (status === "APPROVED") {
            const moveIn = application.moveInDate || new Date();
            const moveOut = new Date(moveIn);
            moveOut.setFullYear(moveOut.getFullYear() + 1);

            await prisma.lease.create({
                data: {
                    tenantId: application.tenantId,
                    propertyId: application.propertyId,
                    applicationId: application.id,
                    startDate: moveIn,
                    endDate: moveOut,
                    monthlyRent: application.property.pricePerMonth,
                    securityDeposit: application.property.securityDeposit,
                    paymentStatus: "PENDING",
                },
            });

            // Mark property unavailable
            await prisma.property.update({
                where: { id: application.propertyId },
                data: { isAvailable: false },
            });
        }

        res.json({ data: updated });
    } catch (err) {
        next(err);
    }
};

// DELETE /api/v1/applications/:id (tenant withdraws)
export const withdrawApplication = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const tenant = await prisma.tenant.findFirst({
            where: { user: { asgardeoId: req.user!.asgardeoId } },
        });

        const application = await prisma.application.findUnique({
            where: { id: req.params.id },
        });

        if (!application) return next(createError("Application not found", 404));
        if (application.tenantId !== tenant?.id) return next(createError("Not authorized", 403));
        if (application.status !== "PENDING") return next(createError("Can only withdraw pending applications", 400));

        const updated = await prisma.application.update({
            where: { id: req.params.id },
            data: { status: "WITHDRAWN" },
        });

        res.json({ data: updated });
    } catch (err) {
        next(err);
    }
};