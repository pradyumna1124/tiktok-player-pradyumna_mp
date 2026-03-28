import { useEffect } from 'react'
import { useVideoEngagement } from './useVideoEngagement.js'
import { useVideoPlayback } from './useVideoPlayback.js'

export function useVideoFeed() {
  const engagement = useVideoEngagement()
  const playback = useVideoPlayback({
    pausedIds: engagement.pausedIds,
    togglePaused: engagement.togglePaused,
  })
  const { cleanupEngagement } = engagement

  useEffect(() => {
    return cleanupEngagement
  }, [cleanupEngagement])

  return {
    ...engagement,
    ...playback,
  }
}
