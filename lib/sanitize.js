import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML string to prevent XSS attacks.
 * Allows safe HTML tags (formatting, lists, links, images) but strips
 * scripts, event handlers, iframes, forms, and other dangerous content.
 */
export function sanitizeHtml(dirty) {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr', 'span', 'div',
      'strong', 'b', 'em', 'i', 'u', 's', 'del', 'ins', 'sub', 'sup',
      'ul', 'ol', 'li',
      'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'blockquote', 'pre', 'code',
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'title',
      'src', 'alt', 'width', 'height',
      'class', 'style',
      'colspan', 'rowspan',
    ],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target'], // allow target on links
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'select', 'button'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
  });
}

/**
 * Strip ALL HTML tags — returns plain text only.
 * Useful for sanitizing user inputs (names, addresses, etc.)
 */
export function stripHtml(dirty) {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}
