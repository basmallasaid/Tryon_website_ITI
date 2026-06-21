import {
  getCacheMeta, saveCacheMeta, deleteCacheMeta,
  saveWardrobeItems, getWardrobeItems,
  saveProducts, getProducts,
  saveStores, getStores,
  saveRecommendations, getRecommendations,
  saveFavorites, getFavorites,
  dataHash,
} from './indexedDB'

// ─── Wardrobe Sync ─────────────────────────────────────────────

export async function syncWardrobeCache({ userId, fetchFn, onData, onCacheLoaded, force = false }) {
  if (!userId) { onData(null); return }

  const apiPromise = navigator.onLine ? fetchFn().catch(() => null) : Promise.resolve(null)

  if (!force) {
    const [meta, cachedItems] = await Promise.all([
      getCacheMeta(userId, 'wardrobe').catch(() => null),
      getWardrobeItems(userId).catch(() => null),
    ])

    if (cachedItems?.length) {
      onCacheLoaded?.(cachedItems)
      onData(cachedItems)
    }

    if (!navigator.onLine) {
      if (!cachedItems?.length) onData(null)
      return
    }

    const res = await apiPromise
    if (!res) {
      if (!cachedItems?.length) onData(null)
      return
    }

    const raw = Array.isArray(res.data) ? res.data : res.data?.items ?? res.data?.wardrobe ?? res.data?.products ?? []
    const freshHash = dataHash(raw)

    if (meta && freshHash === meta.dataHash) {
      saveCacheMeta(userId, 'wardrobe', { dataHash: freshHash }).catch(() => {})
      if (!cachedItems?.length) onData([])
      return
    }

    onData(raw)
    saveWardrobeItems(userId, raw).catch(() => {})
    saveCacheMeta(userId, 'wardrobe', { dataHash: freshHash }).catch(() => {})
  } else {
    if (!navigator.onLine) return

    const res = await apiPromise
    if (!res) return

    const raw = Array.isArray(res.data) ? res.data : res.data?.items ?? res.data?.wardrobe ?? res.data?.products ?? []
    const freshHash = dataHash(raw)

    onData(raw)
    saveWardrobeItems(userId, raw).catch(() => {})
    saveCacheMeta(userId, 'wardrobe', { dataHash: freshHash }).catch(() => {})
  }
}

// ─── Products Sync ─────────────────────────────────────────────

export async function syncProductsCache({ fetchFn, onData, onCacheLoaded, force = false }) {
  const apiPromise = navigator.onLine ? fetchFn().catch(() => null) : Promise.resolve(null)

  if (!force) {
    const [meta, cachedItems] = await Promise.all([
      getCacheMeta(null, 'products').catch(() => null),
      getProducts().catch(() => null),
    ])

    if (cachedItems?.length) {
      onCacheLoaded?.(cachedItems)
      onData(cachedItems)
    }

    if (!navigator.onLine) {
      if (!cachedItems?.length) onData(null)
      return
    }

    const res = await apiPromise
    if (!res) {
      if (!cachedItems?.length) onData(null)
      return
    }

    const raw = Array.isArray(res.data) ? res.data : res.data?.products ?? []
    const freshHash = dataHash(raw)

    if (meta && freshHash === meta.dataHash) {
      saveCacheMeta(null, 'products', { dataHash: freshHash }).catch(() => {})
      if (!cachedItems?.length) onData([])
      return
    }

    onData(raw)
    saveProducts(raw).catch(() => {})
    saveCacheMeta(null, 'products', { dataHash: freshHash }).catch(() => {})
  } else {
    if (!navigator.onLine) return

    const res = await apiPromise
    if (!res) return

    const raw = Array.isArray(res.data) ? res.data : res.data?.products ?? []
    const freshHash = dataHash(raw)

    onData(raw)
    saveProducts(raw).catch(() => {})
    saveCacheMeta(null, 'products', { dataHash: freshHash }).catch(() => {})
  }
}

// ─── Stores Sync ───────────────────────────────────────────────

export async function syncStoresCache({ fetchFn, onData, onCacheLoaded, force = false }) {
  const apiPromise = navigator.onLine ? fetchFn().catch(() => null) : Promise.resolve(null)

  if (!force) {
    const [meta, cachedItems] = await Promise.all([
      getCacheMeta(null, 'stores').catch(() => null),
      getStores().catch(() => null),
    ])

    if (cachedItems?.length) {
      onCacheLoaded?.(cachedItems)
      onData(cachedItems)
    }

    if (!navigator.onLine) {
      if (!cachedItems?.length) onData(null)
      return
    }

    const res = await apiPromise
    if (!res) {
      if (!cachedItems?.length) onData(null)
      return
    }

    const raw = Array.isArray(res.data) ? res.data : res.data?.stores ?? []
    const freshHash = dataHash(raw)

    if (meta && freshHash === meta.dataHash) {
      saveCacheMeta(null, 'stores', { dataHash: freshHash }).catch(() => {})
      if (!cachedItems?.length) onData([])
      return
    }

    onData(raw)
    saveStores(raw).catch(() => {})
    saveCacheMeta(null, 'stores', { dataHash: freshHash }).catch(() => {})
  } else {
    if (!navigator.onLine) return

    const res = await apiPromise
    if (!res) return

    const raw = Array.isArray(res.data) ? res.data : res.data?.stores ?? []
    const freshHash = dataHash(raw)

    onData(raw)
    saveStores(raw).catch(() => {})
    saveCacheMeta(null, 'stores', { dataHash: freshHash }).catch(() => {})
  }
}

// ─── Recommendations Sync ──────────────────────────────────────

export async function syncRecommendationsCache({ userId, fetchFn, onData, onCacheLoaded, force = false }) {
  if (!userId) { onData(null); return }

  const apiPromise = navigator.onLine ? fetchFn().catch(() => null) : Promise.resolve(null)

  if (!force) {
    const [meta, cachedItems] = await Promise.all([
      getCacheMeta(userId, 'recommendations').catch(() => null),
      getRecommendations(userId).catch(() => null),
    ])

    if (cachedItems?.length) {
      onCacheLoaded?.(cachedItems)
      onData(cachedItems)
    }

    if (!navigator.onLine) {
      if (!cachedItems?.length) onData(null)
      return
    }

    const res = await apiPromise
    if (!res) {
      if (!cachedItems?.length) onData(null)
      return
    }

    const raw = Array.isArray(res) ? res : res?.history ?? []
    const freshHash = dataHash(raw)

    if (meta && freshHash === meta.dataHash) {
      saveCacheMeta(userId, 'recommendations', { dataHash: freshHash }).catch(() => {})
      if (!cachedItems?.length) onData([])
      return
    }

    onData(raw)
    saveRecommendations(userId, raw).catch(() => {})
    saveCacheMeta(userId, 'recommendations', { dataHash: freshHash }).catch(() => {})
  } else {
    if (!navigator.onLine) return

    const res = await apiPromise
    if (!res) return

    const raw = Array.isArray(res) ? res : res?.history ?? []
    const freshHash = dataHash(raw)

    onData(raw)
    saveRecommendations(userId, raw).catch(() => {})
    saveCacheMeta(userId, 'recommendations', { dataHash: freshHash }).catch(() => {})
  }
}

// ─── Favorites Sync ────────────────────────────────────────────

export async function syncFavoritesCache({ userId, fetchFn, onData, onCacheLoaded, force = false }) {
  if (!userId) { onData(null); return }

  const apiPromise = navigator.onLine ? fetchFn().catch(() => null) : Promise.resolve(null)

  if (!force) {
    const [meta, cachedItems] = await Promise.all([
      getCacheMeta(userId, 'favorites').catch(() => null),
      getFavorites(userId).catch(() => null),
    ])

    if (cachedItems?.length) {
      onCacheLoaded?.(cachedItems)
      onData(cachedItems)
    }

    if (!navigator.onLine) {
      if (!cachedItems?.length) onData(null)
      return
    }

    const res = await apiPromise
    if (!res) {
      if (!cachedItems?.length) onData(null)
      return
    }

    const raw = Array.isArray(res) ? res : res?.favorites ?? res?.items ?? []
    const freshHash = dataHash(raw)

    if (meta && freshHash === meta.dataHash) {
      saveCacheMeta(userId, 'favorites', { dataHash: freshHash }).catch(() => {})
      if (!cachedItems?.length) onData([])
      return
    }

    onData(raw)
    saveFavorites(userId, raw).catch(() => {})
    saveCacheMeta(userId, 'favorites', { dataHash: freshHash }).catch(() => {})
  } else {
    if (!navigator.onLine) return

    const res = await apiPromise
    if (!res) return

    const raw = Array.isArray(res) ? res : res?.favorites ?? res?.items ?? []
    const freshHash = dataHash(raw)

    onData(raw)
    saveFavorites(userId, raw).catch(() => {})
    saveCacheMeta(userId, 'favorites', { dataHash: freshHash }).catch(() => {})
  }
}

// ─── Invalidation ──────────────────────────────────────────────

export async function invalidateCache(userId, cacheType) {
  await deleteCacheMeta(userId, cacheType)
}
