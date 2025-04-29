import { format, parseISO } from "date-fns";

/**
 * Formats a date string into a human-readable format
 * 
 * @param dateString - ISO date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string | undefined): string {
  if (!dateString) return "Unknown date";
  
  try {
    const date = parseISO(dateString);
    return format(date, "MMMM d, yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
}
