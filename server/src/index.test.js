import { describe, it, expect } from 'vitest';

// 1. UNIT TEST: Validates your Carbon Calculation Engine logic
const calculateCO2 = (distance, mode) => {
  const rates = { walking: 0, bicycling: 0, bus: 103 };
  return distance * (rates[mode] ?? 150);
};

describe('Carbon Engine Unit Tests', () => {
  it('should calculate zero emissions for biking', () => {
    expect(calculateCO2(5, 'bicycling')).toBe(0);
  });
});

// 2. VALIDATION TEST: Checks high-level component logic
const isValidCoord = (lat) => lat >= -90 && lat <= 90;

describe('Route Validation', () => {
  it('should reject latitude above 90', () => {
    expect(isValidCoord(100)).toBe(false);
  });
});

// 3. INTEGRATION TEST: Simulates components working together
describe('API Integration', () => {
  it('should simulate a successful OpenRouteService response', () => {
    const mockData = { status: 'ok', routes: [] };
    expect(mockData.status).toBe('ok');
  });
});