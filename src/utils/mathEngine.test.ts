import { describe, it, expect } from 'vitest'
import { evaluate, factorial, toRad } from './mathEngine'

describe('evaluate - basic arithmetic', () => {
  it('adds two numbers', () => expect(evaluate('2+3')).toBe(5))
  it('subtracts', () => expect(evaluate('10-4')).toBe(6))
  it('multiplies', () => expect(evaluate('3*4')).toBe(12))
  it('divides', () => expect(evaluate('10/4')).toBe(2.5))
  it('handles operator precedence', () => expect(evaluate('2+3*4')).toBe(14))
  it('handles parentheses', () => expect(evaluate('(2+3)*4')).toBe(20))
  it('handles power', () => expect(evaluate('2^10')).toBe(1024))
  it('handles unary minus', () => expect(evaluate('-5+3')).toBe(-2))
  it('chained operations', () => expect(evaluate('5*3-2')).toBe(13))
  it('decimals', () => expect(evaluate('1.5+2.5')).toBe(4))
})

describe('evaluate - constants', () => {
  it('π constant', () => expect(evaluate('π')).toBeCloseTo(Math.PI, 10))
  it('e constant', () => expect(evaluate('e')).toBeCloseTo(Math.E, 10))
  it('2*π', () => expect(evaluate('2*π')).toBeCloseTo(2 * Math.PI, 10))
})

describe('evaluate - trig in DEG mode', () => {
  it('sin(0) = 0', () => expect(evaluate('sin(0)', 'DEG')).toBeCloseTo(0))
  it('sin(90) = 1', () => expect(evaluate('sin(90)', 'DEG')).toBeCloseTo(1))
  it('cos(0) = 1', () => expect(evaluate('cos(0)', 'DEG')).toBeCloseTo(1))
  it('cos(90) = 0', () => expect(evaluate('cos(90)', 'DEG')).toBeCloseTo(0))
  it('tan(45) = 1', () => expect(evaluate('tan(45)', 'DEG')).toBeCloseTo(1))
})

describe('evaluate - trig in RAD mode', () => {
  it('sin(0) = 0', () => expect(evaluate('sin(0)', 'RAD')).toBeCloseTo(0))
  it('sin(π/2) = 1', () => expect(evaluate('sin(π/2)', 'RAD')).toBeCloseTo(1))
  it('cos(π) = -1', () => expect(evaluate('cos(π)', 'RAD')).toBeCloseTo(-1))
  it('tan(π/4) = 1', () => expect(evaluate('tan(π/4)', 'RAD')).toBeCloseTo(1))
})

describe('evaluate - inverse trig', () => {
  it('asin(1) = 90 in DEG', () => expect(evaluate('asin(1)', 'DEG')).toBeCloseTo(90))
  it('acos(1) = 0 in DEG', () => expect(evaluate('acos(1)', 'DEG')).toBeCloseTo(0))
  it('atan(1) = 45 in DEG', () => expect(evaluate('atan(1)', 'DEG')).toBeCloseTo(45))
  it('asin(1) = π/2 in RAD', () => expect(evaluate('asin(1)', 'RAD')).toBeCloseTo(Math.PI / 2))
})

describe('evaluate - logarithms', () => {
  it('log(100) = 2', () => expect(evaluate('log(100)')).toBeCloseTo(2))
  it('log(1) = 0', () => expect(evaluate('log(1)')).toBeCloseTo(0))
  it('ln(e) = 1', () => expect(evaluate('ln(e)')).toBeCloseTo(1))
  it('ln(1) = 0', () => expect(evaluate('ln(1)')).toBeCloseTo(0))
})

describe('evaluate - roots and powers', () => {
  it('sqrt(9) = 3', () => expect(evaluate('sqrt(9)')).toBe(3))
  it('sqrt(2)', () => expect(evaluate('sqrt(2)')).toBeCloseTo(Math.SQRT2))
  it('cbrt(8) = 2', () => expect(evaluate('cbrt(8)')).toBeCloseTo(2))
  it('cbrt(27) = 3', () => expect(evaluate('cbrt(27)')).toBeCloseTo(3))
})

describe('evaluate - factorial', () => {
  it('factorial(0) = 1', () => expect(evaluate('factorial(0)')).toBe(1))
  it('factorial(5) = 120', () => expect(evaluate('factorial(5)')).toBe(120))
  it('factorial(10) = 3628800', () => expect(evaluate('factorial(10)')).toBe(3628800))
})

describe('evaluate - error cases', () => {
  it('throws on division by zero', () => expect(() => evaluate('1/0')).toThrow('Division by zero'))
  it('throws on sqrt of negative', () => expect(() => evaluate('sqrt(-1)')).toThrow())
  it('throws on log of zero', () => expect(() => evaluate('log(0)')).toThrow())
  it('throws on log of negative', () => expect(() => evaluate('log(-1)')).toThrow())
  it('throws on ln of zero', () => expect(() => evaluate('ln(0)')).toThrow())
  it('throws on asin out of domain', () => expect(() => evaluate('asin(2)')).toThrow())
  it('throws on empty expression', () => expect(() => evaluate('')).toThrow())
})

describe('factorial utility', () => {
  it('factorial(0) = 1', () => expect(factorial(0)).toBe(1))
  it('factorial(1) = 1', () => expect(factorial(1)).toBe(1))
  it('factorial(5) = 120', () => expect(factorial(5)).toBe(120))
  it('throws on negative', () => expect(() => factorial(-1)).toThrow())
  it('throws on non-integer', () => expect(() => factorial(2.5)).toThrow())
})

describe('toRad utility', () => {
  it('converts 180 to π', () => expect(toRad(180)).toBeCloseTo(Math.PI))
  it('converts 90 to π/2', () => expect(toRad(90)).toBeCloseTo(Math.PI / 2))
})
