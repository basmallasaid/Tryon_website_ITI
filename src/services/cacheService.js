import {
  getCacheMeta, saveCacheMeta, deleteCacheMeta,
  saveWardrobeItems, getWardrobeItems,
  saveProducts, getProducts,
  saveStores, getStores,
  saveRecommendations, getRecommendations,
  saveFavorites, getFavorites,
  dataHash,
} from './indexedDB'

// ─── Wardrobe Sync (user-scoped) ──────────────────────────────

export async function syncWardrobeCache({ userId, fetchFn, onData, onCacheLoaded, force = false }) {
  if (!userId) { onData(null); return }

  const meta = await getCacheMeta(userId, 'wardrobe')
  let cachedItems = null

  if (meta && !force) {
    cachedItems = await getWardrobeItems(userId)
    if (cachedItems?.length) {
      onCacheLoaded?.(cachedItems)
      onData(cachedItems)
    }
  }

  if (!navigator.onLine) {
    if (!cachedItems?.length) onData(null)
    return
  }

  try {
    const res = await fetchFn()
    const raw = Array.isArray(res.data) ? res.data : res.data?.items ?? res.data?.wardrobe ?? res.data?.products ?? []
    const freshHash = dataHash(raw)

    if (meta && freshHash === meta.dataHash) {
      await saveCacheMeta(userId, 'wardrobe', { dataHash: freshHash })
      if (!force) return
      onData(raw)
      return
    }

    await saveWardrobeItems(userId, raw)
    await saveCacheMeta(userId, 'wardrobe', { dataHash: freshHash })
    onData(raw)
  } catch {
    if (!cachedItems?.length) onData(null)
    else if (force) onData(cachedItems)
  }
}

// ─── Products Sync (public) ───────────────────────────────────

export async function syncProductsCache({ fetchFn, onData, onCacheLoaded, force = false }) {
  const meta = await getCacheMeta(null, 'products')
  let cachedItems = null

  if (meta && !force) {
    cachedItems = await getProducts()
    if (cachedItems?.length) {
      onCacheLoaded?.(cachedItems)
      onData(cachedItems)
    }
  }

  if (!navigator.onLine) {
    if (!cachedItems?.length) onData(null)
    return
  }

  try {
    const res = await fetchFn()
    const raw = Array.isArray(res.data) ? res.data : res.data?.products ?? []
    const freshHash = dataHash(raw)

    if (meta && freshHash === meta.dataHash) {
      await saveCacheMeta(null, 'products', { dataHash: freshHash })
      if (!force) return
      onData(raw)
      return
    }

    await saveProducts(raw)
    await saveCacheMeta(null, 'products', { dataHash: freshHash })
    onData(raw)
  } catch {
    if (!cachedItems?.length) onData(null)
    else if (force) onData(cachedItems)
  }
}

// ─── Stores Sync (public) ─────────────────────────────────────

export async function syncStoresCache({ fetchFn, onData, onCacheLoaded, force = false }) {
  const meta = await getCacheMeta(null, 'stores')
  let cachedItems = null

  if (meta && !force) {
    cachedItems = await getStores()
    if (cachedItems?.length) {
      onCacheLoaded?.(cachedItems)
      onData(cachedItems)
    }
  }

  if (!navigator.onLine) {
    if (!cachedItems?.length) onData(null)
    return
  }

  try {
    const res = await fetchFn()
    const raw = Array.isArray(res.data) ? res.data : res.data?.stores ?? []
    const freshHash = dataHash(raw)

    if (meta && freshHash === meta.dataHash) {
      await saveCacheMeta(null, 'stores', { dataHash: freshHash })
      if (!force) return
      onData(raw)
      return
    }

    await saveStores(raw)
    await saveCacheMeta(null, 'stores', { dataHash: freshHash })
    onData(raw)
  } catch {
    if (!cachedItems?.length) onData(null)
    else if (force) onData(cachedItems)
  }
}

// ─── Recommendations Sync (user-scoped) ────────────────────────

export async function syncRecommendationsCache({ userId, fetchFn, onData, onCacheLoaded, force = false }) {
  if (!userId) { onData(null); return }

  const meta = await getCacheMeta(userId, 'recommendations')
  let cachedItems = null

  if (meta && !force) {
    cachedItems = await getRecommendations(userId)
    if (cachedItems?.length) {
      onCacheLoaded?.(cachedItems)
      onData(cachedItems)
    }
  }

  if (!navigator.onLine) {
    if (!cachedItems?.length) onData(null)
    return
  }

  try {
    const res = await fetchFn()
    const raw = Array.isArray(res) ? res : res?.history ?? []
    const freshHash = dataHash(raw)

    if (meta && freshHash === meta.dataHash) {
      await saveCacheMeta(userId, 'recommendations', { dataHash: freshHash })
      if (!force) return
      onData(raw)
      return
    }

    await saveRecommendations(userId, raw)
    await saveCacheMeta(userId, 'recommendations', { dataHash: freshHash })
    onData(raw)
  } catch {
    if (!cachedItems?.length) onData(null)
    else if (force) onData(cachedItems)
  }
}

// ─── Favorites Sync (user-scoped) ─────────────────────────────

export async function syncFavoritesCache({ userId, fetchFn, onData, onCacheLoaded, force = false }) {
  if (!userId) { onData(null); return }

  const meta = await getCacheMeta(userId, 'favorites')
  let cachedItems = null

  if (meta && !force) {
    cachedItems = await getFavorites(userId)
    if (cachedItems?.length) {
      onCacheLoaded?.(cachedItems)
      onData(cachedItems)
    }
  }

  if (!navigator.onLine) {
    if (!cachedItems?.length) onData(null)
    return
  }

  try {
    const res = await fetchFn()
    const raw = Array.isArray(res) ? res : res?.favorites ?? res?.items ?? []
    const freshHash = dataHash(raw)

    if (meta && freshHash === meta.dataHash) {
      await saveCacheMeta(userId, 'favorites', { dataHash: freshHash })
      if (!force) return
      onData(raw)
      return
    }

    await saveFavorites(userId, raw)
    await saveCacheMeta(userId, 'favorites', { dataHash: freshHash })
    onData(raw)
  } catch {
    if (!cachedItems?.length) onData(null)
    else if (force) onData(cachedItems)
  }
}

// ─── Invalidation ─────────────────────────────────────────────

export async function invalidateCache(userId, cacheType) {
  await deleteCacheMeta(userId, cacheType)
}
