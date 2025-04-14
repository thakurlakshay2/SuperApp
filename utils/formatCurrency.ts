/**
 * Options for currency formatting
 */
interface CurrencyFormatOptions {
  /** Currency symbol (default: '₹') */
  currency?: string;
  /** Locale for number formatting: 'en-IN' for Indian, 'en-US' for American (default: 'en-IN') */
  locale?: string;
  /** Whether to use compact notation (lakhs/crores or millions/billions) (default: true) */
  compact?: boolean;
  /** Number of decimal places (default: 2) */
  decimals?: number;
}

/**
 * Formats a number as currency in either Indian or American format.
 *
 * @param value - The number to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
const formatCurrency = (
  value: number | undefined | null,
  options: CurrencyFormatOptions = {}
): string => {
  if (value === undefined || value === null) return "";

  // Set default values
  const currency = options.currency ?? "₹";
  const locale = options.locale ?? "en-IN";
  const compact = options.compact ?? true;
  const decimals = options.decimals ?? 2;

  // Get absolute value for formatting
  const absValue = Math.abs(value);

  // For compact notation (abbreviated large numbers)
  if (compact) {
    // Indian system (lakhs and crores)
    if (locale === "en-IN") {
      if (absValue >= 10000000) {
        // For values >= 1 crore (10^7)
        return `${currency}${(absValue / 10000000).toFixed(decimals)} Cr`;
      } else if (absValue >= 100000) {
        // For values >= 1 lakh (10^5)
        return `${currency}${(absValue / 100000).toFixed(decimals)} L`;
      } else if (absValue >= 1000) {
        // For values >= 1 thousand
        return `${currency}${(absValue / 1000).toFixed(decimals)}K`;
      }
    }
    // American system (millions and billions)
    else {
      if (absValue >= 1000000000) {
        // For values >= 1 billion (10^9)
        return `${currency}${(absValue / 1000000000).toFixed(decimals)}B`;
      } else if (absValue >= 1000000) {
        // For values >= 1 million (10^6)
        return `${currency}${(absValue / 1000000).toFixed(decimals)}M`;
      } else if (absValue >= 1000) {
        // For values >= 1 thousand
        return `${currency}${(absValue / 1000).toFixed(decimals)}K`;
      }
    }
  }

  // For standard non-compact notation with locale formatting
  return (
    currency +
    absValue.toLocaleString(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  );
};

export default formatCurrency;
