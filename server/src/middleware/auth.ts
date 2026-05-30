import { Request, Response, NextFunction } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { UserRole } from "@prisma/client";
import { createError } from "./errorHandler";

const ORG = process.env.ASGARDEO_ORG_NAME!;
const CLIENT_ID = process.env.ASGARDEO_CLIENT_ID!;

const JWKS = createRemoteJWKSet(
    new URL(`https://api.asgardeo.io/t/${ORG}/oauth2/jwks`)
);

export const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(createError("No token provided", 401));
        }

        const token = authHeader.split(" ")[1];

        const { payload } = await jwtVerify(token, JWKS, {
            issuer: `https://api.asgardeo.io/t/${ORG}/oauth2/token`,
            audience: CLIENT_ID,
        });

        const roles = (payload.roles as string[]) || [];
        const role: UserRole = roles.includes("MANAGER")
            ? UserRole.MANAGER
            : UserRole.TENANT;

        req.user = {
            asgardeoId: payload.sub!,
            email: payload.email as string,
            role,
        };

        next();
    } catch (err) {
        return next(createError("Invalid or expired token", 401));
    }
};

export const requireRole = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next(createError("Not authenticated", 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(createError("Not authorized", 403));
        }
        next();
    };
};