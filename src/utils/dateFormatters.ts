/**
 * Formats an ISO date string into a localized date string.
 *
 * @param dateString - ISO date string to format
 * @returns Formatted date string, or the original string if parsing fails
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      if (import.meta.env.DEV) {
        console.warn('Invalid date string provided to formatDate:', dateString);
      }
      return dateString;
    }
    return date.toLocaleDateString();
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Failed to parse date:', dateString, error);
    }
    return dateString;
  }
}
