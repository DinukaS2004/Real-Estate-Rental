import { Request, Response, NextFunction } from "express";
import prisma from "../utils/prisma";

export const syncUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { asgardeoId, email, role } = req.user!;
        const { name, phoneNumber } = req.body;

        let user = await prisma.user.findUnique({
            where: { asgardeoId },
            include: { tenant: true, manager: true },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    asgardeoId,
                    email,
                    name: name || email.split("@")[0],
                    phoneNumber: phoneNumber || null,
                    role: role as any,
                    ...(role === "TENANT"
                        ? { tenant: { create: {} } }
                        : { manager: { create: {} } }),
                },
                include: { tenant: true, manager: true },
            });
        }

        res.json({ data: user });
    } catch (err) {
        next(err);
    }
};