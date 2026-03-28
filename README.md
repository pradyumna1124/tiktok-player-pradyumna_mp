# TikTok Player

A React + Vite prototype for the Kamao.ai intern task: a TikTok-style vertical video player with one-video-per-screen navigation, interactive overlays, and mobile-first polish.

## demo video link
http://drive.google.com/file/d/1R2ThBMqvqT8M8mK6dy9EA6rSLVuVIIpR/view?usp=drive_link
## Features

- Vertical snapped feed with seamless looping
- 5 local demo videos served from `public/videos`
- Local avatar artwork served from `public/avatars`
- Auto play/pause based on the active card
- Like, follow, play/pause, mute, comments, and share interactions
- Double-tap to like with heart burst animation
- Long-press to pause while holding
- Video progress bar with seek and hover time preview
- Loading skeletons and retry state for media load failures
- Keyboard support: `ArrowUp`, `ArrowDown`, `Space`, `M`

## Architecture

The app uses a small feature-based structure:

```txt
src/
  app/
    App.jsx
  features/
    video-feed/
      components/
        ActionRail.jsx
        EngagementPanel.jsx
        ProgressBar.jsx
        VideoCard.jsx
        VideoFeed.jsx
        VideoOverlay.jsx
      data/
        videos.js
      hooks/
        useActiveVideo.js
        useVideoEngagement.js
        useVideoFeed.js
        useVideoPlayback.js
      utils/
        formatCount.js
        loop.js
        progress.js
scripts/
  run-tests.mjs
```

### Responsibilities

- `VideoFeed` orchestrates the page-level experience.
- `VideoCard` renders one feed item.
- `useVideoPlayback` owns active-video detection, looping, progress, local media state, and keyboard controls.
- `useVideoEngagement` owns likes, follows, pause toggles, double-tap likes, and panels.
- `useVideoFeed` composes the feature hooks into one screen-friendly API.

## Scripts

- `npm run dev` starts the local dev server
- `npm run lint` runs ESLint
- `npm run test` runs the lightweight Node test suite
- `npm run build` creates the production build

## Notes

- Sample videos are stored locally so the demo is more reliable than remote streaming.
- The comments and share panels are intentionally mocked UI for the assessment prototype.
