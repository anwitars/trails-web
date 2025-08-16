const STORAGE_TRAIL_PREFIX = "trail-" as const;

export function* getSavedTrails(): Generator<SavedTrailWithId, void, unknown> {
  const prefixLen = STORAGE_TRAIL_PREFIX.length;
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(STORAGE_TRAIL_PREFIX)) continue;

    const item = localStorage.getItem(key);
    if (!item) continue;

    const { url, token } = JSON.parse(item) as SavedTrail;
    yield { id: key.slice(prefixLen), url, token };
  }
}

export type SavedTrail = {
  // techically we could only do a trailid->token mapping, and peek all trails,
  // but it makes more sense to store the url as well, since we will display it
  url: string;

  token: string;
};

export type SavedTrailWithId = SavedTrail & {
  id: string;
};

export const saveTrail = (trail: SavedTrailWithId): void => {
  localStorage.setItem(
    `${STORAGE_TRAIL_PREFIX}${trail.id}`,
    JSON.stringify({ url: trail.url, token: trail.token } as SavedTrail),
  );
};

export const unsaveTrail = (trailId: string): void =>
  localStorage.removeItem(`${STORAGE_TRAIL_PREFIX}${trailId}`);

export const getSavedTrail = (trailId: string): SavedTrail | null => {
  const item = localStorage.getItem(`${STORAGE_TRAIL_PREFIX}${trailId}`);
  if (!item) return null;

  // let the error page handle the error
  return JSON.parse(item) as SavedTrail;
};
