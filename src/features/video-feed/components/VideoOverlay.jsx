function VideoOverlay({
  isFollowed,
  isHolding,
  isPaused,
  isStatusVisible,
  onFollowToggle,
  progressBar,
  video,
}) {
  return (
    <>
      <div className="video-overlay" />

      {isStatusVisible ? (
        <div
          key={`${video.id}-${isPaused ? 'paused' : 'playing'}-${isHolding ? 'hold' : 'free'}`}
          className="status-chip status-chip--left status-chip--transient"
        >
          {isHolding ? 'Hold pause' : isPaused ? 'Paused' : 'Playing'}
        </div>
      ) : null}

      <div className="video-copy">
        {progressBar}

        <div className="creator-row">
          <div className="avatar-badge">
            <img src={video.user.avatar} alt={`${video.user.name} avatar`} />
          </div>
          <div>
            <p className="creator-name">{video.user.name}</p>
            <p className="creator-handle">{video.user.handle}</p>
          </div>
          <button
            className={`follow-button ${isFollowed ? 'follow-button--active' : ''}`}
            type="button"
            onClick={onFollowToggle}
          >
            {isFollowed ? 'Following' : 'Follow'}
          </button>
        </div>

        <p className="description">{video.description}</p>
        <p className="music-line">Audio: {video.music}</p>
      </div>
    </>
  )
}

export default VideoOverlay
