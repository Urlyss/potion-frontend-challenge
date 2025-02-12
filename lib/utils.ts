import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMoney(amount:number, currency = 'USD', locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
  }).format(amount);
}

export const formatAvgHold = (value: string) => {
  const minutes = Number.parseInt(value.split(" ")[0])
  if (minutes < 60) {
    return `${minutes}m`
  } else if (minutes < 1440) {
    const hours = Math.floor(minutes / 60)
    return `${hours}h`
  } else {
    const days = Math.floor(minutes / 1440)
    return `${days}d`
  }
}

/**
 * Formats a Solana address (Pubkey) for better readability.
 *
 * @param {string} address - The Solana address (Pubkey) to format.
 * @param {number} [startChars=4] - Number of characters to show at the beginning.
 * @param {number} [endChars=4] - Number of characters to show at the end.
 * @param {string} [separator="..."] - Separator to use in the middle.
 * @returns {string} - The formatted Solana address.  Returns the original address if it's not a string or is too short.
 */
export function formatSolanaAddress(
  address: string,
  startChars: number = 4,
  endChars: number = 4,
  separator: string = "..."
): string {
  if (typeof address !== 'string') {
    return address; // Or throw an error if you prefer
  }

  if (address.length <= (startChars + endChars)) {
    return address;
  }

  const start = address.substring(0, startChars);
  const end = address.substring(address.length - endChars);
  return `${start}${separator}${end}`;
}

export const SOL_PRICE = 200