export function getLoopResetIndex(activeIndex, feedLength, videoLength) {
  if (activeIndex === 0) {
    return videoLength
  }

  if (activeIndex === feedLength - 1) {
    return 1
  }

  return null
}
