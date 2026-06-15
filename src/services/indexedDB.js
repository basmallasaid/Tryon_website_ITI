const DB_NAME = 'ReDolapyCache'
const DB_VERSION = 5

let dbPromise = null

function getDB() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onupgradeneeded = (event) => {
        const db = event.target.result

        if (db.objectStoreNames.contains('cache')) {
          db.deleteObjectStore('cache')
        }

        if (!db.objectStoreNames.contains('wardrobe')) {
          const store = db.createObjectStore('wardrobe', { keyPath: '_id' })
          store.createIndex('userId', 'userId', { unique: false })
          store.createIndex('category', 'category', { unique: false })
        }

        if (!db.objectStoreNames.contains('products')) {
          const store = db.createObjectStore('products', { keyPath: '_id' })
          store.createIndex('store_id', 'store_id', { unique: false })
          store.createIndex('category', 'category', { unique: false })
        }

        if (!db.objectStoreNames.contains('stores')) {
          db.createObjectStore('stores', { keyPath: '_id' })
        }

        if (!db.objectStoreNames.contains('cache_meta')) {
          db.createObjectStore('cache_meta', { keyPath: 'key' })
        }

        if (!db.objectStoreNames.contains('recommendations')) {
          const store = db.createObjectStore('recommendations', { keyPath: '_id' })
          store.createIndex('userId', 'userId', { unique: false })
          store.createIndex('created_at', 'created_at', { unique: false })
        }

        if (!db.objectStoreNames.contains('favorites')) {
          const store = db.createObjectStore('favorites', { keyPath: '_id' })
          store.createIndex('userId', 'userId', { unique: false })
          store.createIndex('itemType', 'itemType', { unique: false })
        }

        if (!db.objectStoreNames.contains('user_profile')) {
          db.createObjectStore('user_profile', { keyPath: 'userId' })
        }

        if (!db.objectStoreNames.contains('subscription')) {
          db.createObjectStore('subscription', { keyPath: 'userId' })
        }

        if (!db.objectStoreNames.contains('product_matches')) {
          db.createObjectStore('product_matches', { keyPath: 'productId' })
        }
      }

      request.onsuccess = (event) => resolve(event.target.result)
      request.onerror = (event) => { dbPromise = null; reject(event.target.error) }
    })
  }
  return dbPromise
}

function normalizeId(id) {
  if (!id) return null
  if (typeof id === 'object') {
    return String(id.$oid || id._id || '')
  }
  return String(id)
}

function buildMetaKey(userId, cacheType) {
  return userId ? `${userId}:${cacheType}` : `public:${cacheType}`
}

// ─── Cache Meta ───────────────────────────────────────────────

export async function getCacheMeta(userId, cacheType) {
  const key = buildMetaKey(userId, cacheType)
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('cache_meta', 'readonly')
    const store = tx.objectStore('cache_meta')
    const request = store.get(key)
    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
  })
}

export async function saveCacheMeta(userId, cacheType, extra = {}) {
  const key = buildMetaKey(userId, cacheType)
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('cache_meta', 'readwrite')
    const store = tx.objectStore('cache_meta')
    const entry = { key, userId: userId || null, cacheType, updatedAt: Date.now(), ...extra }
    const request = store.put(entry)
    request.onsuccess = () => resolve(entry)
    request.onerror = () => reject(request.error)
  })
}

export async function deleteCacheMeta(userId, cacheType) {
  const key = buildMetaKey(userId, cacheType)
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('cache_meta', 'readwrite')
    const store = tx.objectStore('cache_meta')
    const request = store.delete(key)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

// ─── Wardrobe ─────────────────────────────────────────────────

export async function saveWardrobeItems(userId, items) {
  if (!userId) return
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('wardrobe', 'readwrite')
    const store = tx.objectStore('wardrobe')
    const index = store.index('userId')

    const range = IDBKeyRange.only(userId)
    const getKeysReq = index.getAllKeys(range)

    getKeysReq.onsuccess = () => {
      const oldKeys = getKeysReq.result
      for (const key of oldKeys) store.delete(key)

      const raw = Array.isArray(items) ? items : items?.items ?? items?.wardrobe ?? items?.products ?? []
      for (const item of raw) {
        const id = normalizeId(item._id || item.id)
        if (id) store.put({ ...item, _id: id, userId })
      }
    }

    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getWardrobeItems(userId) {
  if (!userId) return []
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('wardrobe', 'readonly')
    const store = tx.objectStore('wardrobe')
    const index = store.index('userId')
    const range = IDBKeyRange.only(userId)
    const request = index.getAll(range)

    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
    tx.oncomplete = () => {}
  })
}

// ─── Products ─────────────────────────────────────────────────

export async function saveProducts(items) {
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('products', 'readwrite')
    const store = tx.objectStore('products')

    const getKeysReq = store.getAllKeys()
    getKeysReq.onsuccess = () => {
      const oldKeys = getKeysReq.result
      for (const key of oldKeys) store.delete(key)

      const raw = Array.isArray(items) ? items : items?.data ?? items?.products ?? []
      for (const item of raw) {
        const id = normalizeId(item._id || item.id)
        if (id) store.put({ ...item, _id: id })
      }
    }

    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getProducts() {
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('products', 'readonly')
    const store = tx.objectStore('products')
    const request = store.getAll()

    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
    tx.oncomplete = () => {}
  })
}

// ─── Stores ───────────────────────────────────────────────────

export async function saveStores(items) {
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('stores', 'readwrite')
    const store = tx.objectStore('stores')

    const getKeysReq = store.getAllKeys()
    getKeysReq.onsuccess = () => {
      const oldKeys = getKeysReq.result
      for (const key of oldKeys) store.delete(key)

      const raw = Array.isArray(items) ? items : items?.data ?? items?.stores ?? []
      for (const item of raw) {
        const id = normalizeId(item._id || item.id)
        if (id) store.put({ ...item, _id: id })
      }
    }

    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getStores() {
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('stores', 'readonly')
    const store = tx.objectStore('stores')
    const request = store.getAll()

    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
    tx.oncomplete = () => {}
  })
}

// ─── Recommendations ──────────────────────────────────────────

export async function saveRecommendations(userId, items) {
  if (!userId) return
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('recommendations', 'readwrite')
    const store = tx.objectStore('recommendations')
    const index = store.index('userId')

    const range = IDBKeyRange.only(userId)
    const getKeysReq = index.getAllKeys(range)

    getKeysReq.onsuccess = () => {
      const oldKeys = getKeysReq.result
      for (const key of oldKeys) store.delete(key)

      const raw = Array.isArray(items) ? items : items?.history ?? []
      for (const item of raw) {
        const id = item._id || item.id
        if (id) store.put({ ...item, _id: id, userId })
      }
    }

    tx.oncomplete = () => { resolve() }
    tx.onerror = () => { reject(tx.error) }
  })
}

export async function getRecommendations(userId) {
  if (!userId) return []
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('recommendations', 'readonly')
    const store = tx.objectStore('recommendations')
    const index = store.index('userId')
    const range = IDBKeyRange.only(userId)
    const request = index.getAll(range)

    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
    tx.oncomplete = () => {}
  })
}

// ─── Favorites ─────────────────────────────────────────────────

export async function saveFavorites(userId, items) {
  if (!userId) return
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('favorites', 'readwrite')
    const store = tx.objectStore('favorites')
    const index = store.index('userId')

    const range = IDBKeyRange.only(userId)
    const getKeysReq = index.getAllKeys(range)

    getKeysReq.onsuccess = () => {
      const oldKeys = getKeysReq.result
      for (const key of oldKeys) store.delete(key)

      const raw = Array.isArray(items) ? items : []
      for (const item of raw) {
        const id = item._id || item.id
        if (id) store.put({ ...item, _id: id, userId })
      }
    }

    tx.oncomplete = () => { resolve() }
    tx.onerror = () => { reject(tx.error) }
  })
}

export async function getFavorites(userId) {
  if (!userId) return []
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('favorites', 'readonly')
    const store = tx.objectStore('favorites')
    const index = store.index('userId')
    const range = IDBKeyRange.only(userId)
    const request = index.getAll(range)

    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
    tx.oncomplete = () => {}
  })
}

// ─── User Profile ─────────────────────────────────────────────

export async function saveProfile(userId, data) {
  if (!userId) return
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('user_profile', 'readwrite')
    const store = tx.objectStore('user_profile')
    const request = store.put({ userId, data, updatedAt: Date.now() })
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
    tx.oncomplete = () => { resolve() }
  })
}

export async function getProfile(userId) {
  if (!userId) return null
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('user_profile', 'readonly')
    const store = tx.objectStore('user_profile')
    const request = store.get(userId)
    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
    tx.oncomplete = () => {}
  })
}

export async function deleteProfile(userId) {
  if (!userId) return
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('user_profile', 'readwrite')
    const store = tx.objectStore('user_profile')
    const request = store.delete(userId)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
    tx.oncomplete = () => { resolve() }
  })
}

// ─── Subscription ─────────────────────────────────────────────

export async function saveSubscription(userId, data) {
  if (!userId) return
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('subscription', 'readwrite')
    const store = tx.objectStore('subscription')
    const request = store.put({ userId, data, updatedAt: Date.now() })
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
    tx.oncomplete = () => { resolve() }
  })
}

export async function getSubscription(userId) {
  if (!userId) return null
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('subscription', 'readonly')
    const store = tx.objectStore('subscription')
    const request = store.get(userId)
    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
    tx.oncomplete = () => {}
  })
}

export async function deleteSubscription(userId) {
  if (!userId) return
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('subscription', 'readwrite')
    const store = tx.objectStore('subscription')
    const request = store.delete(userId)
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
    tx.oncomplete = () => { resolve() }
  })
}

// ─── User Data Clear ──────────────────────────────────────────

export async function clearUserCaches(userId) {
  if (!userId) return
  const db = await getDB()

  await Promise.all([
    new Promise((resolve, reject) => {
      const tx = db.transaction('wardrobe', 'readwrite')
      const store = tx.objectStore('wardrobe')
      const index = store.index('userId')
      const range = IDBKeyRange.only(userId)
      const req = index.openCursor(range)
      req.onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor) { store.delete(cursor.primaryKey); cursor.continue() }
        else resolve()
      }
      req.onerror = () => reject(req.error)
      tx.oncomplete = () => resolve()
    }),
    new Promise((resolve, reject) => {
      const tx = db.transaction('cache_meta', 'readwrite')
      const store = tx.objectStore('cache_meta')
      const req = store.openCursor()
      req.onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor) {
          if (cursor.value.userId === userId) store.delete(cursor.primaryKey)
          cursor.continue()
        } else resolve()
      }
      req.onerror = () => reject(req.error)
      tx.oncomplete = () => resolve()
    }),
    new Promise((resolve, reject) => {
      const tx = db.transaction('recommendations', 'readwrite')
      const store = tx.objectStore('recommendations')
      const index = store.index('userId')
      const range = IDBKeyRange.only(userId)
      const req = index.openCursor(range)
      req.onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor) { store.delete(cursor.primaryKey); cursor.continue() }
        else resolve()
      }
      req.onerror = () => reject(req.error)
      tx.oncomplete = () => resolve()
    }),
    new Promise((resolve, reject) => {
      const tx = db.transaction('favorites', 'readwrite')
      const store = tx.objectStore('favorites')
      const index = store.index('userId')
      const range = IDBKeyRange.only(userId)
      const req = index.openCursor(range)
      req.onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor) { store.delete(cursor.primaryKey); cursor.continue() }
        else resolve()
      }
      req.onerror = () => reject(req.error)
      tx.oncomplete = () => resolve()
    }),
    new Promise((resolve, reject) => {
      const tx = db.transaction('user_profile', 'readwrite')
      const store = tx.objectStore('user_profile')
      const req = store.delete(userId)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
      tx.oncomplete = () => resolve()
    }),
    new Promise((resolve, reject) => {
      const tx = db.transaction('subscription', 'readwrite')
      const store = tx.objectStore('subscription')
      const req = store.delete(userId)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
      tx.oncomplete = () => resolve()
    }),
    ])
}

// ─── Product Matches (lightweight cache) ──────────────────────

export async function saveProductMatches(productId, data) {
  if (!productId) return
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('product_matches', 'readwrite')
    const store = tx.objectStore('product_matches')
    const request = store.put({ productId, hasMatches: data.hasMatches, matches: data.matches || [], updatedAt: Date.now() })
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
    tx.oncomplete = () => { resolve() }
  })
}

export async function getProductMatches(productId) {
  if (!productId) return null
  const db = await getDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction('product_matches', 'readonly')
    const store = tx.objectStore('product_matches')
    const request = store.get(productId)
    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
    tx.oncomplete = () => {}
  })
}

export async function getBatchProductMatches(productIds) {
  if (!productIds?.length) return {}
  const db = await getDB()
  return new Promise((resolve) => {
    const tx = db.transaction('product_matches', 'readonly')
    const store = tx.objectStore('product_matches')
    const results = {}
    let completed = 0

    if (productIds.length === 0) { resolve(results); return }

    productIds.forEach(id => {
      const request = store.get(id)
      request.onsuccess = () => {
        if (request.result) {
          results[id] = { hasMatches: request.result.hasMatches, matches: request.result.matches || [], updatedAt: request.result.updatedAt }
        }
        completed++
        if (completed === productIds.length) { resolve(results) }
      }
      request.onerror = () => {
        completed++
        if (completed === productIds.length) { resolve(results) }
      }
    })
  })
}

export async function saveBatchProductMatches(matchesMap) {
  const db = await getDB()
  return new Promise((resolve) => {
    const tx = db.transaction('product_matches', 'readwrite')
    const store = tx.objectStore('product_matches')
    const entries = Object.entries(matchesMap)

    if (entries.length === 0) { resolve(); return }

    let completed = 0
    entries.forEach(([productId, data]) => {
      const request = store.put({
        productId,
        hasMatches: data.hasMatches,
        matches: data.matches || [],
        updatedAt: Date.now(),
      })
      request.onsuccess = () => {
        completed++
        if (completed === entries.length) { resolve() }
      }
      request.onerror = () => {
        completed++
        if (completed === entries.length) { resolve() }
      }
    })
  })
}

export async function getWardrobeHash() {
  const auth = (() => {
    try {
      const raw = localStorage.getItem('auth')
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })()
  const userId = auth?._id || auth?.user?._id
  if (!userId) return ''
  const items = await getWardrobeItems(userId).catch(() => [])
  const hash = dataHash(items.map(i => i._id || i.id).filter(Boolean).sort())
  return hash
}

// ─── Data Hash (for sync comparison) ──────────────────────────

export function dataHash(obj) {
  if (!obj) return ''
  let hash = 0
  const str = typeof obj === 'string' ? obj : JSON.stringify(obj)
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash.toString(36)
}
