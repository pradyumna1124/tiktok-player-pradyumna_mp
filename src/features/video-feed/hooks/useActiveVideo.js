import { useEffect } from 'react'

export function useActiveVideo({ containerRef, cardRefs, onActiveChange }) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let bestEntry = null

        for (const entry of entries) {
          if (!entry.isIntersecting) {
            continue
          }

          if (
            !bestEntry ||
            entry.intersectionRatio > bestEntry.intersectionRatio
          ) {
            bestEntry = entry
          }
        }

        if (!bestEntry) {
          return
        }

        const nextIndex = Number(bestEntry.target.dataset.index)
        if (!Number.isNaN(nextIndex)) {
          onActiveChange(nextIndex)
        }
      },
      {
        root: containerRef.current,
        threshold: [0.55, 0.75],
      },
    )

    for (const card of cardRefs.current) {
      if (card) {
        observer.observe(card)
      }
    }

    return () => observer.disconnect()
  }, [cardRefs, containerRef, onActiveChange])
}
