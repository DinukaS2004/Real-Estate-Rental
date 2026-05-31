export const asgardeoConfig = {
    signInRedirectURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    signOutRedirectURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    clientID: process.env.NEXT_PUBLIC_ASGARDEO_CLIENT_ID!,
    baseUrl: `https://api.asgardeo.io/t/${process.env.NEXT_PUBLIC_ASGARDEO_ORG_NAME}`,
    scope: ["openid", "profile", "email", "roles"],
    disableTrySignInSilently: false,
};