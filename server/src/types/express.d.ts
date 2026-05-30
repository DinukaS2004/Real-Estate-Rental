import { UserRole } from "@prisma/client";

/**
 * Augments Express's Request type so that `req.user` is typed after the
 * Asgardeo OIDC middleware populates it from the verified JWT.
 *
 * Asgardeo issues an OIDC access-token whose `sub` claim is the unique,
 * immutable user identifier — stored as `asgardeoId` in the database.
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        /** Asgardeo `sub` claim — the unique user identifier from the OIDC token */
        asgardeoId: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

export {};
