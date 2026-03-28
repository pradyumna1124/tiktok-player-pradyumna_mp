export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export function getProgressRatio(currentTime = 0, duration = 0) {
  if (!duration || Number.isNaN(duration)) {
    return 0
  }

  return clamp(currentTime / duration, 0, 1)
}

export function getSeekTime(clientX, rect, duration = 0) {
  if (!duration || !rect?.width) {
    return 0
  }

  const ratio = clamp((clientX - rect.left) / rect.width, 0, 1)
  return duration * ratio
}

export function formatTime(seconds = 0) {
  const safeSeconds = Math.max(0, Math.floor(seconds))
  const minutes = Math.floor(safeSeconds / 60)
  const remainder = String(safeSeconds % 60).padStart(2, '0')
  return `${minutes}:${remainder}`
}
