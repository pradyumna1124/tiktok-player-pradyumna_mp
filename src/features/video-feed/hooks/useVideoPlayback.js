import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { loopedVideos, videos } from '../data/videos.js'
import { getLoopResetIndex } from '../utils/loop.js'
import { getProgressRatio, getSeekTime } from '../utils/progress.js'
import { useActiveVideo } from './useActiveVideo.js'

const LOOP_RESET_DELAY_MS = 180
const LONG_PRESS_DELAY_MS = 320

export function useVideoPlayback({ pausedIds, togglePaused }) {
  const [activeIndex, setActiveIndex] = useState(1)
  const [isMuted, setIsMuted] = useState(true)
  const [loadedIds, setLoadedIds] = useState(() => new Set())
  const [errorIds, setErrorIds] = useState(() => new Set())
  const [progressById, setProgressById] = useState({})
  const [previewById, setPreviewById] = useState({})
  const [holdingId, setHoldingId] = useState(null)

  const containerRef = useRef(null)
  const cardRefs = useRef([])
  const videoRefs = useRef([])
  const longPressTimerRef = useRef(null)
  const suppressTapRef = useRef(false)
  const animationFrameRef = useRef(null)

  const feed = loopedVideos
  const activeVideo = feed[activeIndex]

  const scrollToIndex = (nextIndex, behavior = 'smooth') => {
    const safeIndex = Math.max(0, Math.min(feed.length - 1, nextIndex))
    cardRefs.current[safeIndex]?.scrollIntoView({
      behavior,
      block: 'start',
    })
  }

  const markLoaded = (id) => {
    setLoadedIds((current) => {
      if (current.has(id)) {
        return current
      }

      const next = new Set(current)
      next.add(id)
      return next
    })

    setErrorIds((current) => {
      if (!current.has(id)) {
        return current
      }

      const next = new Set(current)
      next.delete(id)
      return next
    })
  }

  const markErrored = (id) => {
    setErrorIds((current) => {
      if (current.has(id)) {
        return current
      }

      const next = new Set(current)
      next.add(id)
      return next
    })
  }

  const updateProgress = (id, video) => {
    if (!video) {
      return
    }

    setProgressById((current) => ({
      ...current,
      [id]: {
        currentTime: video.currentTime,
        duration: video.duration || current[id]?.duration || 0,
        ratio: getProgressRatio(video.currentTime, video.duration),
      },
    }))
  }

  const handleLoadedMetadata = (id, video) => {
    if (!video) {
      return
    }

    markLoaded(id)
    setProgressById((current) => ({
      ...current,
      [id]: {
        currentTime: video.currentTime || 0,
        duration: video.duration || 0,
        ratio: getProgressRatio(video.currentTime, video.duration),
      },
    }))
  }

  const showPreview = (id, clientX, trackRect) => {
    const duration = progressById[id]?.duration || 0
    const previewTime = getSeekTime(clientX, trackRect, duration)
    const ratio = trackRect?.width
      ? Math.min(Math.max((clientX - trackRect.left) / trackRect.width, 0), 1)
      : 0

    setPreviewById((current) => ({
      ...current,
      [id]: { ratio, time: previewTime },
    }))
  }

  const hidePreview = (id) => {
    setPreviewById((current) => {
      if (!current[id]) {
        return current
      }

      const next = { ...current }
      delete next[id]
      return next
    })
  }

  const seekTo = (id, index, clientX, trackRect) => {
    const video = videoRefs.current[index]
    if (!video) {
      return
    }

    video.currentTime = getSeekTime(clientX, trackRect, video.duration)
    updateProgress(id, video)
  }

  const retryVideo = (id, index) => {
    const video = videoRefs.current[index]

    setErrorIds((current) => {
      if (!current.has(id)) {
        return current
      }

      const next = new Set(current)
      next.delete(id)
      return next
    })

    if (video) {
      video.load()
      const playAttempt = video.play()
      if (playAttempt?.catch) {
        playAttempt.catch(() => {})
      }
    }
  }

  const handlePointerDown = (id) => {
    window.clearTimeout(longPressTimerRef.current)
    longPressTimerRef.current = window.setTimeout(() => {
      suppressTapRef.current = true
      setHoldingId(id)
    }, LONG_PRESS_DELAY_MS)
  }

  const releaseLongPress = () => {
    window.clearTimeout(longPressTimerRef.current)

    if (holdingId !== null) {
      setHoldingId(null)
      window.setTimeout(() => {
        suppressTapRef.current = false
      }, 0)
    }
  }

  const shouldSuppressTap = () => {
    if (!suppressTapRef.current) {
      return false
    }

    suppressTapRef.current = false
    return true
  }

  const handleKeyDown = useEffectEvent((event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      scrollToIndex(activeIndex + 1)
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      scrollToIndex(activeIndex - 1)
    }

    if (event.code === 'Space') {
      event.preventDefault()
      togglePaused(activeVideo.id)
    }

    if (event.key.toLowerCase() === 'm') {
      event.preventDefault()
      setIsMuted((current) => !current)
    }
  })

  useActiveVideo({
    containerRef,
    cardRefs,
    onActiveChange: setActiveIndex,
  })

  useEffect(() => {
    const resetIndex = getLoopResetIndex(activeIndex, feed.length, videos.length)
    let timeoutId = null

    if (resetIndex !== null) {
      timeoutId = window.setTimeout(() => {
        setActiveIndex(resetIndex)
        cardRefs.current[resetIndex]?.scrollIntoView({
          behavior: 'auto',
          block: 'start',
        })
      }, LOOP_RESET_DELAY_MS)
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [activeIndex, feed.length])

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) {
        return
      }

      const card = feed[index]
      const shouldPlay =
        index === activeIndex &&
        !pausedIds.has(card.id) &&
        holdingId !== card.id &&
        !errorIds.has(card.id)

      video.muted = isMuted

      if (shouldPlay) {
        const playAttempt = video.play()
        if (playAttempt?.catch) {
          playAttempt.catch(() => {})
        }
      } else {
        video.pause()
      }
    })
  }, [activeIndex, errorIds, feed, holdingId, isMuted, pausedIds])

  useEffect(() => {
    const activePlaybackVideo = videoRefs.current[activeIndex]
    const activeCard = feed[activeIndex]
    const shouldTrack =
      activePlaybackVideo &&
      activeCard &&
      !pausedIds.has(activeCard.id) &&
      holdingId !== activeCard.id &&
      !errorIds.has(activeCard.id)

    if (!shouldTrack) {
      return undefined
    }

    const syncProgress = () => {
      updateProgress(activeCard.id, activePlaybackVideo)
      animationFrameRef.current = window.requestAnimationFrame(syncProgress)
    }

    animationFrameRef.current = window.requestAnimationFrame(syncProgress)

    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [activeIndex, errorIds, feed, holdingId, pausedIds])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    return () => {
      window.clearTimeout(longPressTimerRef.current)
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return {
    activeIndex,
    cardRefs,
    containerRef,
    errorIds,
    feed,
    handleLoadedMetadata,
    handlePointerDown,
    hidePreview,
    holdingId,
    isMuted,
    loadedIds,
    markErrored,
    previewById,
    progressById,
    releaseLongPress,
    retryVideo,
    scrollToIndex,
    seekTo,
    setIsMuted,
    shouldSuppressTap,
    showPreview,
    updateProgress,
    videoRefs,
  }
}
