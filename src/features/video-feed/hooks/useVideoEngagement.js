import { useRef, useState } from 'react'

const HEART_BURST_DELAY_MS = 700

export function useVideoEngagement() {
  const [likedIds, setLikedIds] = useState(() => new Set())
  const [followedIds, setFollowedIds] = useState(() => new Set())
  const [pausedIds, setPausedIds] = useState(() => new Set())
  const [heartBurstId, setHeartBurstId] = useState(null)
  const [panelState, setPanelState] = useState(null)

  const tapTimerRef = useRef(null)

  const toggleSetValue = (setState, id) => {
    setState((current) => {
      const next = new Set(current)

      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }

      return next
    })
  }

  const togglePaused = (id) => toggleSetValue(setPausedIds, id)
  const toggleLike = (id) => toggleSetValue(setLikedIds, id)
  const toggleFollow = (id) => toggleSetValue(setFollowedIds, id)

  const closePanel = () => setPanelState(null)

  const openPanel = (type, videoId) => {
    setPanelState((current) => {
      if (current?.type === type && current.videoId === videoId) {
        return null
      }

      return { type, videoId }
    })
  }

  const showLikeBurst = (id) => {
    toggleLike(id)
    setHeartBurstId(id)
    window.setTimeout(
      () => setHeartBurstId((current) => (current === id ? null : current)),
      HEART_BURST_DELAY_MS,
    )
  }

  const handleSurfaceTap = (id, shouldSuppressTap) => {
    if (shouldSuppressTap?.()) {
      return
    }

    togglePaused(id)
  }

  const handleSurfaceDoubleTap = (id, shouldSuppressTap) => {
    if (shouldSuppressTap?.()) {
      return
    }

    showLikeBurst(id)
  }

  const cleanupEngagement = () => {
    if (tapTimerRef.current) {
      window.clearTimeout(tapTimerRef.current)
    }
  }

  return {
    closePanel,
    cleanupEngagement,
    followedIds,
    handleSurfaceDoubleTap,
    handleSurfaceTap,
    heartBurstId,
    likedIds,
    openPanel,
    panelState,
    pausedIds,
    toggleFollow,
    toggleLike,
    togglePaused,
  }
}
