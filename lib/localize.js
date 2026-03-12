/**
 * Get a localized field value from an object.
 * Falls back to the original (Romanian) value if translation is not available.
 * 
 * @param {Object} obj - The data object (product, category, blog post, etc.)
 * @param {string} field - The base field name (e.g., 'name', 'description', 'title')
 * @param {string} lang - The language code ('ro', 'ru', 'en')
 * @returns {string} The localized value or fallback to original
 * 
 * @example
 * localize(product, 'name', 'ru')  // returns product.nameRu || product.name
 * localize(product, 'description', 'en')  // returns product.descriptionEn || product.description
 */
export function localize(obj, field, lang) {
  if (!obj) return '';
  if (!lang || lang === 'ro') return obj[field] || '';
  
  const suffix = lang === 'ru' ? 'Ru' : lang === 'en' ? 'En' : '';
  if (!suffix) return obj[field] || '';
  
  const localizedKey = field + suffix;
  return obj[localizedKey] || obj[field] || '';
}

/**
 * Get a localized setting value.
 * Settings use a flat key-value structure: heroTitle, heroTitleRu, heroTitleEn
 * 
 * @param {Object} settings - The settings object
 * @param {string} key - The base setting key (e.g., 'heroTitle')
 * @param {string} lang - The language code
 * @returns {string} The localized setting value
 */
export function localizeSettings(settings, key, lang) {
  if (!settings) return '';
  if (!lang || lang === 'ro') return settings[key] || '';
  
  const suffix = lang === 'ru' ? 'Ru' : lang === 'en' ? 'En' : '';
  if (!suffix) return settings[key] || '';
  
  const localizedKey = key + suffix;
  return settings[localizedKey] || settings[key] || '';
}
