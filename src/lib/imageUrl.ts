export function imageUrl(path: string): string {
  const basePath = process.env.NODE_ENV === "production" ? "/frenchApartments" : "";
  return `${basePath}${path}`;
}
