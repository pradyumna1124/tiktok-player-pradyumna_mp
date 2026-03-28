import ActionRail from './ActionRail.jsx'
import EngagementPanel from './EngagementPanel.jsx'
import ProgressBar from './ProgressBar.jsx'
import VideoOverlay from './VideoOverlay.jsx'

function VideoCard({
  closePanel,
  errorMessage,
  index,
  isActive,
  isFollowed,
  isHolding,
  isLiked,
  isLoaded,
  isMuted,
  isPaused,
  isProgressVisible,
  isStatusVisible,
  onComments,
  onFollowToggle,
  onLike,
  onMuteToggle,
  onPauseToggle,
  onPointerCancel,
  onPointerDown,
  onPointerUp,
  onPreviewHide,
  onPreviewMove,
  onRetry,
  onSeek,
  onShare,
  onSurfaceTap,
  onSurfaceDoubleTap,
  onVideoError,
  onVideoLoadedData,
  onVideoLoadedMetadata,
  onVideoTimeUpdate,
  panelState,
  preview,
  progress,
  registerCardRef,
  registerVideoRef,
  showHeartBurst,
  video,
}) {
  return (
    <article
      ref={registerCardRef}
      data-index={index}
      data-video-id={video.id}
      className="video-card"
      style={{
        '--accent-start': video.palette[0],
        '--accent-end': video.palette[1],
      }}
    >
      <div
        className="video-surface"
        role="button"
        tabIndex={0}
        aria-label={`Toggle playback for ${video.user.name}`}
        onClick={onSurfaceTap}
        onDoubleClick={onSurfaceDoubleTap}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerLeave={onPointerCancel}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            onPauseToggle()
          }
        }}
      >
        {!isLoaded && <div className="video-skeleton" aria-hidden="true" />}

        <video
          ref={registerVideoRef}
          className="video-element"
          src={video.url}
          loop
          playsInline
          preload="metadata"
          muted={isMuted}
          onLoadedData={onVideoLoadedData}
          onLoadedMetadata={onVideoLoadedMetadata}
          onTimeUpdate={onVideoTimeUpdate}
          onError={onVideoError}
        />

        <VideoOverlay
          isFollowed={isFollowed}
          isHolding={isHolding}
          isPaused={isPaused}
          isStatusVisible={isStatusVisible}
          onFollowToggle={onFollowToggle}
          progressBar={
            <ProgressBar
              animationKey={`${video.id}-${isPaused ? 'paused' : 'playing'}-${isActive ? 'active' : 'idle'}`}
              isVisible={isProgressVisible}
              onPreviewHide={onPreviewHide}
              onPreviewMove={onPreviewMove}
              onSeek={onSeek}
              preview={preview}
              progress={progress}
            />
          }
          video={video}
        />

        {errorMessage ? (
          <div className="video-error" onClick={(event) => event.stopPropagation()}>
            <p>Video failed to load locally.</p>
            <p className="video-error__detail">{errorMessage}</p>
            <button className="video-error__retry" type="button" onClick={onRetry}>
              Retry clip
            </button>
          </div>
        ) : null}

        {showHeartBurst && isActive ? (
          <div className="heart-burst" aria-hidden="true">
            <span>+</span>
            <span className="heart-burst__icon">LIKE</span>
          </div>
        ) : null}

        <ActionRail
          isLiked={isLiked}
          isMuted={isMuted}
          isPaused={isPaused}
          onComments={onComments}
          onLike={onLike}
          onMuteToggle={onMuteToggle}
          onPauseToggle={onPauseToggle}
          onShare={onShare}
          stats={{
            comments: video.comments,
            likes: video.likes,
            shares: video.shares,
          }}
        />

        <EngagementPanel
          onClose={closePanel}
          panelState={panelState}
          video={video}
        />
      </div>
    </article>
  )
}

export default VideoCard
