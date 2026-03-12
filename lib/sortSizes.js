/**
 * Sorts an array of size objects { size, stock, ... } in ascending order.
 * - Numeric sizes (38, 40, 42 …) → sorted numerically
 * - Alphabetic sizes (XS, S, M, L, XL, XXL …) → sorted by standard clothing order
 * - Mixed arrays → numeric first, then alphabetic
 */
const ALPHA_SIZE_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '3XL', '4XL', '5XL'];

export function sortSizes(sizes = []) {
  return [...sizes].sort((a, b) => {
    const aNum = parseFloat(a.size);
    const bNum = parseFloat(b.size);
    const aIsNum = !isNaN(aNum) && String(a.size).trim() !== '';
    const bIsNum = !isNaN(bNum) && String(b.size).trim() !== '';

    // Both numeric → ascending numeric
    if (aIsNum && bIsNum) return aNum - bNum;

    // Both alphabetic → use predefined order, fallback to localeCompare
    if (!aIsNum && !bIsNum) {
      const aIdx = ALPHA_SIZE_ORDER.indexOf(String(a.size).toUpperCase());
      const bIdx = ALPHA_SIZE_ORDER.indexOf(String(b.size).toUpperCase());
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
      if (aIdx !== -1) return -1;
      if (bIdx !== -1) return 1;
      return String(a.size).localeCompare(String(b.size));
    }

    // Mixed → numeric before alphabetic
    return aIsNum ? -1 : 1;
  });
}
