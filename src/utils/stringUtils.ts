
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')         // Replace spaces with -
    .replace(/&/g, '-and-')       // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')     // Remove all non-word characters
    .replace(/\-\-+/g, '-')       // Replace multiple - with single -
    .replace(/^-+/, '')           // Trim - from start of text
    .replace(/-+$/, '');          // Trim - from end of text
}

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function capitalizeWords(string: string): string {
  return string
    .split(' ')
    .map(word => capitalizeFirstLetter(word))
    .join(' ');
}

export function formatApplicationType(type: string): string {
  return capitalizeWords(type);
}
