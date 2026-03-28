import assert from 'node:assert/strict'
import { formatCount } from '../src/features/video-feed/utils/formatCount.js'
import { getLoopResetIndex } from '../src/features/video-feed/utils/loop.js'
import {
  formatTime,
  getProgressRatio,
  getSeekTime,
} from '../src/features/video-feed/utils/progress.js'

function runTest(name, testFn) {
  try {
    testFn()
    console.log(`PASS ${name}`)
  } catch (error) {
    console.error(`FAIL ${name}`)
    console.error(error)
    process.exitCode = 1
  }
}

runTest('formatCount formats thousands and millions', () => {
  assert.equal(formatCount(950), '950')
  assert.equal(formatCount(1200), '1.2K')
  assert.equal(formatCount(2500000), '2.5M')
})

runTest('getLoopResetIndex returns loop targets for cloned cards', () => {
  assert.equal(getLoopResetIndex(0, 7, 5), 5)
  assert.equal(getLoopResetIndex(6, 7, 5), 1)
  assert.equal(getLoopResetIndex(3, 7, 5), null)
})

runTest('progress helpers clamp and format correctly', () => {
  assert.equal(getProgressRatio(25, 100), 0.25)
  assert.equal(getProgressRatio(10, 0), 0)
  assert.equal(getSeekTime(75, { left: 25, width: 100 }, 120), 60)
  assert.equal(formatTime(125), '2:05')
})

if (process.exitCode !== 1) {
  console.log('All tests passed')
}
