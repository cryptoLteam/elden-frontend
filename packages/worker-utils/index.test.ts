import { describe, it, expect } from 'vitest'
import { CORS_ALLOW, isOriginAllowed } from './index'

describe('worker-utils', () => {
  it.each([
    ['https://elden.fi', true],
    ['https://pancakeswap.com', true],
    ['https://aptoselden.fi', false],
    ['https://aptos.elden.fi', true],
    ['https://elden.fi.com', false],
    ['http://elden.fi', false],
    ['https://pancake.run', false],
    ['https://test.pancake.run', true],
    ['http://localhost:3000', true],
    ['http://localhost:3001', true],
  ])(`isOriginAllowed(%s)`, (origin, expected) => {
    expect(isOriginAllowed(origin, CORS_ALLOW)).toBe(expected)
  })
})
