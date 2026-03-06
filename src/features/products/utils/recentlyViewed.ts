export type RecentlyViewedItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  category?: string;
  rating?: number;
};

const KEY = "recentlyViewed";
const MAX = 8;

export function getRecentlyViewed(): RecentlyViewedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setRecentlyViewed(items: RecentlyViewedItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX)));
}

export function addRecentlyViewed(item: RecentlyViewedItem) {
  if (typeof window === "undefined") return;

  const list = getRecentlyViewed();
  const next = [item, ...list.filter((x) => x.id !== item.id)].slice(0, MAX);
  setRecentlyViewed(next);
}