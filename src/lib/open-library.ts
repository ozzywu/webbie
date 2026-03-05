const OL_COVERS = "https://covers.openlibrary.org/b";
const OL_SEARCH = "https://openlibrary.org/search.json";

export function getCoverUrlByIsbn(
  isbn: string,
  size: "S" | "M" | "L" = "L",
): string {
  return `${OL_COVERS}/isbn/${isbn}-${size}.jpg`;
}

export function getCoverUrlById(
  coverId: number,
  size: "S" | "M" | "L" = "L",
): string {
  return `${OL_COVERS}/id/${coverId}-${size}.jpg`;
}

export async function searchCover(
  title: string,
  author: string,
): Promise<string | null> {
  const q = encodeURIComponent(`${title} ${author}`);
  const url = `${OL_SEARCH}?q=${q}&limit=1&fields=cover_i`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const coverId = data?.docs?.[0]?.cover_i;
    if (!coverId) return null;
    return getCoverUrlById(coverId, "L");
  } catch {
    return null;
  }
}
