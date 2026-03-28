import { formatTime } from '../utils/progress.js'

function ProgressBar({
  animationKey,
  isVisible,
  onPreviewHide,
  onPreviewMove,
  onSeek,
  preview,
  progress,
}) {
  const ratio = progress?.ratio ?? 0
  const currentTime = progress?.currentTime ?? 0
  const duration = progress?.duration ?? 0

  return (
    <div
      key={animationKey}
      className={`progress-shell ${isVisible ? 'progress-shell--transient' : ''}`}
    >
      <div
        className="progress-track"
        role="slider"
        tabIndex={0}
        aria-label="Video progress"
        aria-valuemin={0}
        aria-valuemax={Math.max(duration, 0)}
        aria-valuenow={Math.floor(currentTime)}
        onClick={onSeek}
        onMouseMove={onPreviewMove}
        onMouseLeave={onPreviewHide}
        onFocus={onPreviewMove}
        onBlur={onPreviewHide}
      >
        <div className="progress-fill" style={{ transform: `scaleX(${ratio})` }} />
        <div className="progress-thumb" style={{ left: `${ratio * 100}%` }} />
        {preview ? (
          <div className="progress-preview" style={{ left: `${preview.ratio * 100}%` }}>
            {formatTime(preview.time)}
          </div>
        ) : null}
      </div>
      <div className="progress-meta" aria-hidden="true">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  )
}

export default ProgressBar
