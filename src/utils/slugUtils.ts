// Generate URL-friendly slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .substring(0, 100); // Limit length
};

// Parse slug back to search terms for database lookup
export const parseSlug = (slug: string): string => {
  return slug.replace(/-/g, ' ');
};

// Generate full SEO-friendly URL for an opportunity
export const generateOpportunityUrl = (id: string, title: string): string => {
  const slug = generateSlug(title);
  return `/opportunity/${slug}-${id.substring(0, 8)}`;
};

// Extract ID from slug URL (last 8 characters after final hyphen)
export const extractIdFromSlug = (slugWithId: string): string | null => {
  // Try to extract UUID segment from the end
  const parts = slugWithId.split('-');
  if (parts.length < 2) return slugWithId;
  
  // Check if last part looks like a UUID segment
  const lastPart = parts[parts.length - 1];
  if (lastPart.length === 8 && /^[a-f0-9]+$/.test(lastPart)) {
    return lastPart;
  }
  
  // If no UUID pattern found, return the full slug (might be a direct ID)
  return slugWithId;
};
