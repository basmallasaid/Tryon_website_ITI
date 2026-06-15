import { useRef, useCallback } from 'react'
import { syncWithCache, invalidateCache } from '../services/cacheService'

export function useCacheSync({ userId, cacheType, fetchFn }) {
  const pendingRef = useRef(null)

  const sync = useCallback(async ({ onData, onCacheLoaded, force = false } = {}) => {
    if (pendingRef.current) {
      return pendingRef.current
    }

    const promise = syncWithCache({
      userId,
      cacheType,
      fetchFn,
      onData,
      onCacheLoaded,
      force,
    })

    pendingRef.current = promise
    try {
      await promise
    } finally {
      if (pendingRef.current === promise) {
        pendingRef.current = null
      }
    }
  }, [userId, cacheType, fetchFn])

  const clear = useCallback(async () => {
    await invalidateCache(userId, cacheType)
  }, [userId, cacheType])

  return { sync, clear }
}
