import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// This is used by Shadcn components — must exist
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(price);

export const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });