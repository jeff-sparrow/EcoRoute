import { describe, it, expect } from 'vitest'

describe('Local Storage Service', () => {
  it('stores and retrieves data correctly', () => {
    localStorage.setItem('test', 'value')
    const value = localStorage.getItem('test')

    expect(value).toBe('value')
  })
})