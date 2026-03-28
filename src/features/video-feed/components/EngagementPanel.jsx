function EngagementPanel({ onClose, panelState, video }) {
  if (!panelState) {
    return null
  }

  const title = panelState.type === 'comments' ? 'Comments' : 'Share'

  return (
    <section
      className="engagement-panel"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="engagement-panel__header">
        <div>
          <p className="engagement-panel__eyebrow">{video.user.handle}</p>
          <h2>{title}</h2>
        </div>
        <button className="engagement-panel__close" type="button" onClick={onClose}>
          Close
        </button>
      </div>

      {panelState.type === 'comments' ? (
        <div className="engagement-list">
          {video.commentsPreview.map((comment) => (
            <article key={comment} className="engagement-card">
              <div className="engagement-card__avatar" aria-hidden="true">
                {video.user.name.slice(0, 1)}
              </div>
              <div>
                <p className="engagement-card__author">{video.user.name}</p>
                <p className="engagement-card__copy">{comment}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="share-grid">
          {video.shareTargets.map((target) => (
            <button key={target} className="share-chip" type="button">
              {target}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

export default EngagementPanel
