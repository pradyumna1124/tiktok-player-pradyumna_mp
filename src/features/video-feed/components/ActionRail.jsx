import { formatCount } from '../utils/formatCount.js'

function ActionIcon({ children }) {
  return (
    <span className="icon-button__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" className="action-icon">
        {children}
      </svg>
    </span>
  )
}

function ActionRail({
  isLiked,
  isMuted,
  isPaused,
  onComments,
  onLike,
  onMuteToggle,
  onPauseToggle,
  onShare,
  stats,
}) {
  const items = [
    {
      id: 'like',
      active: isLiked,
      tone: 'pink',
      label: formatCount(stats.likes + (isLiked ? 1 : 0)),
      onClick: onLike,
      ariaLabel: 'Like video',
      icon: (
        <path d="M12 20.6s-7.1-4.6-9.4-8.5c-1.4-2.4-.6-5.7 2-7 1.9-.9 4.1-.4 5.7 1.4l1.7 1.9 1.7-1.9c1.6-1.8 3.8-2.3 5.7-1.4 2.6 1.3 3.4 4.6 2 7-2.3 3.9-9.4 8.5-9.4 8.5Z" />
      ),
    },
    {
      id: 'comment',
      tone: 'blue',
      label: formatCount(stats.comments),
      onClick: onComments,
      ariaLabel: 'Comments',
      icon: (
        <path d="M6.3 6.8h11.4c1.8 0 3.2 1.4 3.2 3.2v5.2c0 1.8-1.4 3.2-3.2 3.2H12l-4.2 3v-3H6.3c-1.8 0-3.2-1.4-3.2-3.2V10c0-1.8 1.4-3.2 3.2-3.2Z" />
      ),
    },
    {
      id: 'share',
      tone: 'violet',
      label: formatCount(stats.shares),
      onClick: onShare,
      ariaLabel: 'Share video',
      icon: (
        <>
          <path d="m10 14 9-9" />
          <path d="M12.2 5H19v6.8" />
          <path d="M19 14.8v1.4A2.8 2.8 0 0 1 16.2 19H7.8A2.8 2.8 0 0 1 5 16.2V7.8A2.8 2.8 0 0 1 7.8 5H9.2" />
        </>
      ),
    },
    {
      id: 'pause',
      tone: 'amber',
      label: isPaused ? 'Play' : 'Pause',
      onClick: onPauseToggle,
      ariaLabel: isPaused ? 'Play video' : 'Pause video',
      icon: isPaused ? (
        <path d="M9 7.5v9l7-4.5-7-4.5Z" />
      ) : (
        <>
          <path d="M9 7.2v9.6" />
          <path d="M15 7.2v9.6" />
        </>
      ),
    },
    {
      id: 'mute',
      tone: 'teal',
      label: isMuted ? 'Mute' : 'Sound',
      onClick: onMuteToggle,
      ariaLabel: isMuted ? 'Unmute video' : 'Mute video',
      icon: isMuted ? (
        <>
          <path d="M4.8 10.2h3.4L12.5 7v10l-4.3-3.2H4.8z" />
          <path d="m16 9 4 6" />
          <path d="m20 9-4 6" />
        </>
      ) : (
        <>
          <path d="M4.8 10.2h3.4L12.5 7v10l-4.3-3.2H4.8z" />
          <path d="M16.6 9.2a4.4 4.4 0 0 1 0 5.6" />
          <path d="M19 6.6a7.7 7.7 0 0 1 0 10.8" />
        </>
      ),
    },
  ]

  return (
    <aside className="action-rail">
      <div className="action-rail__glass" />
      {items.map((item) => (
        <div key={item.id} className="action-item">
          <button
            className={`icon-button icon-button--${item.tone} ${item.active ? 'icon-button--active' : ''}`}
            type="button"
            onClick={item.onClick}
            aria-label={item.ariaLabel}
          >
            <ActionIcon>{item.icon}</ActionIcon>
          </button>
          <span className={`icon-button__label icon-button__label--${item.tone}`}>
            {item.label}
          </span>
        </div>
      ))}
    </aside>
  )
}

export default ActionRail
