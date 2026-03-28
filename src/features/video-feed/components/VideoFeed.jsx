import { useVideoFeed } from '../hooks/useVideoFeed.js'
import '../video-feed.css'
import VideoCard from './VideoCard.jsx'

function VideoFeed() {
  const {
    activeIndex,
    cardRefs,
    closePanel,
    containerRef,
    errorIds,
    feed,
    followedIds,
    handleSurfaceDoubleTap,
    handleSurfaceTap,
    handleLoadedMetadata,
    handlePointerDown,
    hidePreview,
    holdingId,
    heartBurstId,
    isMuted,
    likedIds,
    loadedIds,
    markErrored,
    openPanel,
    panelState,
    pausedIds,
    previewById,
    progressById,
    releaseLongPress,
    retryVideo,
    seekTo,
    setIsMuted,
    shouldSuppressTap,
    showPreview,
    toggleFollow,
    toggleLike,
    togglePaused,
    updateProgress,
    videoRefs,
  } = useVideoFeed()

  return (
    <main className="app-shell">
      <header className="top-bar">
        <div>
          <p className="eyebrow">React Intern Task Prototype</p>
          <h1>TikTok-style video player</h1>
        </div>
      </header>

      <section className="phone-frame">
        <div className="feed" ref={containerRef}>
          {feed.map((video, index) => {
            const isLiked = likedIds.has(video.id)
            const isFollowed = followedIds.has(video.id)
            const isPaused = pausedIds.has(video.id)
            const isLoaded = loadedIds.has(video.id)

            return (
              <VideoCard
                closePanel={closePanel}
                key={`${video.id}-${index}`}
                errorMessage={errorIds.has(video.id) ? 'Tap retry to reload the local clip.' : ''}
                index={index}
                isActive={index === activeIndex}
                isFollowed={isFollowed}
                isHolding={holdingId === video.id}
                isLiked={isLiked}
                isLoaded={isLoaded}
                isMuted={isMuted}
                isPaused={isPaused}
                isProgressVisible={index === activeIndex}
                isStatusVisible={index === activeIndex}
                onComments={(event) => {
                  event?.stopPropagation()
                  if (
                    panelState?.type === 'comments' &&
                    panelState.videoId === video.id
                  ) {
                    closePanel()
                    return
                  }
                  openPanel('comments', video.id)
                }}
                onFollowToggle={(event) => {
                  event.stopPropagation()
                  toggleFollow(video.id)
                }}
                onLike={(event) => {
                  event.stopPropagation()
                  toggleLike(video.id)
                }}
                onMuteToggle={(event) => {
                  event.stopPropagation()
                  setIsMuted((current) => !current)
                }}
                onPauseToggle={(event) => {
                  event?.stopPropagation()
                  togglePaused(video.id)
                }}
                onPointerCancel={releaseLongPress}
                onPointerDown={() => handlePointerDown(video.id)}
                onPointerUp={releaseLongPress}
                onPreviewHide={() => hidePreview(video.id)}
                onPreviewMove={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect()
                  const clientX = event.clientX ?? rect.left
                  showPreview(video.id, clientX, rect)
                }}
                onRetry={(event) => {
                  event.stopPropagation()
                  retryVideo(video.id, index)
                }}
                onSeek={(event) => {
                  event.stopPropagation()
                  const rect = event.currentTarget.getBoundingClientRect()
                  seekTo(video.id, index, event.clientX, rect)
                }}
                onShare={(event) => {
                  event?.stopPropagation()
                  if (
                    panelState?.type === 'share' &&
                    panelState.videoId === video.id
                  ) {
                    closePanel()
                    return
                  }
                  openPanel('share', video.id)
                }}
                onSurfaceTap={() =>
                  handleSurfaceTap(video.id, shouldSuppressTap)
                }
                onSurfaceDoubleTap={() =>
                  handleSurfaceDoubleTap(video.id, shouldSuppressTap)
                }
                onVideoError={() => markErrored(video.id)}
                onVideoLoadedData={() => handleLoadedMetadata(video.id, videoRefs.current[index])}
                onVideoLoadedMetadata={() =>
                  handleLoadedMetadata(video.id, videoRefs.current[index])
                }
                onVideoTimeUpdate={() =>
                  updateProgress(video.id, videoRefs.current[index])
                }
                panelState={
                  panelState?.videoId === video.id ? panelState : null
                }
                preview={previewById[video.id]}
                progress={progressById[video.id]}
                registerCardRef={(node) => {
                  cardRefs.current[index] = node
                }}
                registerVideoRef={(node) => {
                  videoRefs.current[index] = node
                }}
                showHeartBurst={heartBurstId === video.id}
                video={video}
              />
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default VideoFeed
