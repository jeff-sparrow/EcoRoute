export const store = {
  users: new Map(),
  savedRoutesByUser: new Map(),
  tripsByUser: new Map(),
};

export const ensureUserCollections = (userId) => {
  if (!store.savedRoutesByUser.has(userId)) store.savedRoutesByUser.set(userId, []);
  if (!store.tripsByUser.has(userId)) store.tripsByUser.set(userId, []);
};
