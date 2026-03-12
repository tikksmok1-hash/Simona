import sanitize from 'sanitize-html';

/**
 * Sanitize HTML string to prevent XSS attacks.
 * Allows safe HTML tags (formatting, lists, links, images) but strips
 * scripts, event handlers, iframes, forms, and other dangerous content.
 *
 * Uses sanitize-html which is pure JS — works on Vercel serverless
 * (isomorphic-dompurify / jsdom crashes there due to ESM/CJS conflict).
 */
export function sanitizeHtml(dirty) {
  if (!dirty) return '';
  return sanitize(dirty, {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr', 'span', 'div',
      'strong', 'b', 'em', 'i', 'u', 's', 'del', 'ins', 'sub', 'sup',
      'ul', 'ol', 'li',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'blockquote', 'pre', 'code',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel', 'title'],
      img: ['src', 'alt', 'width', 'height'],
      '*': ['class', 'style'],
      td: ['colspan', 'rowspan'],
      th: ['colspan', 'rowspan'],
    },
    disallowedTagsMode: 'discard',
  });
}

/**
 * Strip ALL HTML tags — returns plain text only.
 * Useful for sanitizing user inputs (names, addresses, etc.)
 */
export function stripHtml(dirty) {
  if (!dirty) return '';
  return sanitize(dirty, { allowedTags: [], allowedAttributes: {} });
}
