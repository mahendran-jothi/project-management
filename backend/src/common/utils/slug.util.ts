export function generateSlug(title: string): string {
    return title.toLowerCase().trim().replace(/\s+/g, '-');
}
