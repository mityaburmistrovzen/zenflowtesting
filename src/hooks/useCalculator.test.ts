import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCalculator } from './useCalculator'

describe('useCalculator - initial state', () => {
  it('starts with display 0', () => {
    const { result } = renderHook(() => useCalculator())
    expect(result.current.state.display).toBe('0')
  })

  it('starts with empty expression', () => {
    const { result } = renderHook(() => useCalculator())
    expect(result.current.state.expression).toBe('')
  })

  it('starts in DEG mode', () => {
    const { result } = renderHook(() => useCalculator())
    expect(result.current.state.angleMode).toBe('DEG')
  })

  it('starts with no error', () => {
    const { result } = renderHook(() => useCalculator())
    expect(result.current.state.error).toBeNull()
  })
})

describe('useCalculator - digit input', () => {
  it('types a digit', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => result.current.handleDigit('5'))
    expect(result.current.state.display).toBe('5')
  })

  it('types multiple digits', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => { result.current.handleDigit('1'); result.current.handleDigit('2'); result.current.handleDigit('3') })
    expect(result.current.state.display).toBe('123')
  })

  it('replaces leading zero', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => result.current.handleDigit('5'))
    expect(result.current.state.display).toBe('5')
  })

  it('after result, starts fresh', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => { result.current.handleDigit('5'); result.current.handleEquals() })
    act(() => result.current.handleDigit('3'))
    expect(result.current.state.display).toBe('3')
    expect(result.current.state.expression).toBe('')
  })
})

describe('useCalculator - decimal', () => {
  it('adds decimal point', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => { result.current.handleDigit('3'); result.current.handleDecimal() })
    expect(result.current.state.display).toBe('3.')
  })

  it('does not add second decimal', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => { result.current.handleDigit('3'); result.current.handleDecimal(); result.current.handleDecimal() })
    expect(result.current.state.display).toBe('3.')
  })
})

describe('useCalculator - basic arithmetic', () => {
  it('2 + 3 = 5', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => {
      result.current.handleDigit('2')
      result.current.handleOperator('+')
      result.current.handleDigit('3')
      result.current.handleEquals()
    })
    expect(result.current.state.display).toBe('5')
    expect(result.current.state.isResult).toBe(true)
  })

  it('10 - 4 = 6', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => {
      result.current.handleDigit('1')
      result.current.handleDigit('0')
      result.current.handleOperator('-')
      result.current.handleDigit('4')
      result.current.handleEquals()
    })
    expect(result.current.state.display).toBe('6')
  })

  it('3 * 4 = 12', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => {
      result.current.handleDigit('3')
      result.current.handleOperator('*')
      result.current.handleDigit('4')
      result.current.handleEquals()
    })
    expect(result.current.state.display).toBe('12')
  })

  it('10 / 4 = 2.5', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => {
      result.current.handleDigit('1')
      result.current.handleDigit('0')
      result.current.handleOperator('/')
      result.current.handleDigit('4')
      result.current.handleEquals()
    })
    expect(result.current.state.display).toBe('2.5')
  })
})

describe('useCalculator - error handling', () => {
  it('division by zero shows Error', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => {
      result.current.handleDigit('1')
      result.current.handleOperator('/')
      result.current.handleDigit('0')
      result.current.handleEquals()
    })
    expect(result.current.state.display).toBe('Error')
    expect(result.current.state.error).not.toBeNull()
  })
})

describe('useCalculator - clear', () => {
  it('C clears everything', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => {
      result.current.handleDigit('5')
      result.current.handleOperator('+')
      result.current.handleDigit('3')
      result.current.handleClear()
    })
    expect(result.current.state.display).toBe('0')
    expect(result.current.state.expression).toBe('')
  })

  it('CE clears current entry', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => {
      result.current.handleDigit('5')
      result.current.handleOperator('+')
      result.current.handleDigit('3')
      result.current.handleClearEntry()
    })
    expect(result.current.state.display).toBe('0')
    expect(result.current.state.expression).toBe('5+')
  })
})

describe('useCalculator - toggle sign', () => {
  it('negates positive number', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => { result.current.handleDigit('5'); result.current.handleToggleSign() })
    expect(result.current.state.display).toBe('-5')
  })

  it('un-negates negative number', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => { result.current.handleDigit('5'); result.current.handleToggleSign(); result.current.handleToggleSign() })
    expect(result.current.state.display).toBe('5')
  })
})

describe('useCalculator - percent', () => {
  it('converts 50 to 0.5', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => { result.current.handleDigit('5'); result.current.handleDigit('0'); result.current.handlePercent() })
    expect(result.current.state.display).toBe('0.5')
  })
})

describe('useCalculator - angle mode', () => {
  it('toggles DEG to RAD', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => result.current.handleAngleMode())
    expect(result.current.state.angleMode).toBe('RAD')
  })

  it('toggles RAD back to DEG', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => { result.current.handleAngleMode(); result.current.handleAngleMode() })
    expect(result.current.state.angleMode).toBe('DEG')
  })
})

describe('useCalculator - constants', () => {
  it('π inserts pi value', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => result.current.handleConstant('π'))
    expect(parseFloat(result.current.state.display)).toBeCloseTo(Math.PI, 5)
  })

  it('e inserts euler value', () => {
    const { result } = renderHook(() => useCalculator())
    act(() => result.current.handleConstant('e'))
    expect(parseFloat(result.current.state.display)).toBeCloseTo(Math.E, 5)
  })
})
