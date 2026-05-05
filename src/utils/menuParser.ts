/**
 * Represents a parsed menu item
 */
export interface MenuItem {
  name: string;
  price?: number;
}

/**
 * Result of parsing the menu field
 */
export interface ParsedMenu {
  type: 'text' | 'items' | 'url' | 'empty';
  content: string | MenuItem[];
  displayUrl?: string;
}

/**
 * Parse restaurant.menu field
 * Handles:
 * - Plain text → return as text
 * - Comma/semicolon separated items → parse into list
 * - URLs or PDF links → return as URL type
 * - Empty/missing → return empty type
 */
export function parseMenuField(menu: string | undefined): ParsedMenu {
  if (!menu || menu.trim() === '') {
    return {
      type: 'empty',
      content: 'Menú no disponible por ahora.',
    };
  }

  const trimmed = menu.trim();

  // Check if it's a URL or PDF link
  if (isUrlOrPdf(trimmed)) {
    return {
      type: 'url',
      content: '',
      displayUrl: trimmed,
    };
  }

  // Try to parse as comma/semicolon separated items
  const items = parseMenuItems(trimmed);
  if (items.length > 1) {
    return {
      type: 'items',
      content: items,
    };
  }

  // If only one item or no delimiters found, treat as plain text
  return {
    type: 'text',
    content: trimmed,
  };
}

/**
 * Check if string is a URL or PDF link
 */
function isUrlOrPdf(text: string): boolean {
  const urlPattern = /^https?:\/\/.+|\.pdf$/i;
  return urlPattern.test(text);
}

/**
 * Parse menu items from delimited string
 * Tries to extract price if present after " - " or " $ "
 */
function parseMenuItems(text: string): MenuItem[] {
  // Try comma separator first
  let delimiter = ',';
  let parts = text.split(delimiter);

  // If only 1 part, try semicolon
  if (parts.length === 1) {
    delimiter = ';';
    parts = text.split(delimiter);
  }

  // If only 1 part, try line breaks
  if (parts.length === 1) {
    delimiter = '\n';
    parts = text.split(delimiter);
  }

  // If still only 1 part, return empty
  if (parts.length === 1) {
    return [];
  }

  return parts
    .map((part) => parseMenuItem(part.trim()))
    .filter((item) => item.name.length > 0);
}

/**
 * Parse a single menu item string
 * Formats: "Name" or "Name - $Price" or "Name - Price"
 */
function parseMenuItem(text: string): MenuItem {
  const dashIndex = text.lastIndexOf(' - ');
  const dollarIndex = text.lastIndexOf('$');

  let name = text;
  let price: number | undefined;

  if (dashIndex !== -1) {
    name = text.substring(0, dashIndex).trim();
    const priceStr = text.substring(dashIndex + 3).trim();
    price = extractPrice(priceStr);
  } else if (dollarIndex !== -1) {
    name = text.substring(0, dollarIndex).trim();
    const priceStr = text.substring(dollarIndex).trim();
    price = extractPrice(priceStr);
  }

  return { name, price };
}

/**
 * Extract numeric price from string like "$38.000" or "38000"
 */
function extractPrice(priceStr: string): number | undefined {
  const cleaned = priceStr.replace(/[$\s]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? undefined : num;
}
