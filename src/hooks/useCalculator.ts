import { useState, useCallback } from 'react'
import { evaluate, type AngleMode } from '../utils/mathEngine'

export interface CalculatorState {
  expression: string
  display: string
  isResult: boolean
  angleMode: AngleMode
  error: string | null
}

const INITIAL_STATE: CalculatorState = {
  expression: '',
  display: '0',
  isResult: false,
  angleMode: 'DEG',
  error: null,
}

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>(INITIAL_STATE)

  const handleDigit = useCallback((digit: string) => {
    setState(prev => {
      if (prev.error) return prev
      if (prev.isResult) {
        return { ...prev, expression: '', display: digit, isResult: false }
      }
      const newDisplay = prev.display === '0' ? digit : prev.display + digit
      return { ...prev, display: newDisplay }
    })
  }, [])

  const handleDecimal = useCallback(() => {
    setState(prev => {
      if (prev.error) return prev
      if (prev.isResult) {
        return { ...prev, expression: '', display: '0.', isResult: false }
      }
      if (prev.display.includes('.')) return prev
      return { ...prev, display: prev.display + '.' }
    })
  }, [])

  const handleOperator = useCallback((op: string) => {
    setState(prev => {
      if (prev.error) return prev

      if (op === '(') {
        const expr = prev.isResult
          ? '('
          : prev.expression
            ? prev.expression + '('
            : '('
        return { ...prev, expression: expr, display: '0', isResult: false }
      }

      if (op === ')') {
        const expr = prev.isResult
          ? prev.display + ')'
          : prev.expression + prev.display + ')'
        return { ...prev, expression: expr, display: '0', isResult: false }
      }

      const currentDisplay = prev.display
      let newExpression: string

      if (prev.isResult) {
        newExpression = currentDisplay + op
      } else if (prev.expression && !prev.expression.match(/[+\-*/^]$/)) {
        newExpression = prev.expression + currentDisplay + op
      } else if (prev.expression && prev.expression.match(/[+\-*/^]$/)) {
        newExpression = prev.expression.slice(0, -1) + op
      } else {
        newExpression = currentDisplay + op
      }

      return {
        ...prev,
        expression: newExpression,
        display: '0',
        isResult: false,
      }
    })
  }, [])

  const handleEquals = useCallback(() => {
    setState(prev => {
      if (prev.error) return prev
      const fullExpr = prev.isResult
        ? prev.display
        : prev.expression + prev.display

      if (!fullExpr || fullExpr === '0') {
        return { ...prev, expression: '', isResult: true }
      }

      try {
        const result = evaluate(fullExpr, prev.angleMode)
        const resultStr = formatResult(result)
        return {
          ...prev,
          expression: fullExpr + '=',
          display: resultStr,
          isResult: true,
          error: null,
        }
      } catch (err) {
        return {
          ...prev,
          expression: fullExpr,
          display: 'Error',
          isResult: true,
          error: err instanceof Error ? err.message : 'Error',
        }
      }
    })
  }, [])

  const handleScientific = useCallback((fn: string) => {
    setState(prev => {
      if (prev.error) return prev

      if (fn === 'x²') {
        if (prev.isResult) {
          const expr = `(${prev.display})^2`
          try {
            const result = evaluate(expr, prev.angleMode)
            return {
              ...prev,
              expression: expr + '=',
              display: formatResult(result),
              isResult: true,
              error: null,
            }
          } catch (err) {
            return { ...prev, display: 'Error', isResult: true, error: err instanceof Error ? err.message : 'Error' }
          }
        }
        const newExpression = prev.expression + prev.display + '^2'
        return { ...prev, expression: newExpression, display: '0', isResult: false }
      }

      if (fn === 'xʸ') {
        const base = prev.isResult ? prev.display : prev.expression + prev.display
        return { ...prev, expression: base + '^', display: '0', isResult: false }
      }

      if (fn === 'n!') {
        const operand = prev.isResult ? prev.display : prev.expression + prev.display
        const expr = `factorial(${operand})`
        try {
          const result = evaluate(expr, prev.angleMode)
          return {
            ...prev,
            expression: expr + '=',
            display: formatResult(result),
            isResult: true,
            error: null,
          }
        } catch (err) {
          return { ...prev, display: 'Error', isResult: true, error: err instanceof Error ? err.message : 'Error' }
        }
      }

      const currentDisplay = prev.display
      const newExpression = prev.isResult
        ? `${fn}(${currentDisplay})`
        : prev.expression
          ? `${prev.expression}${fn}(`
          : `${fn}(`

      if (prev.isResult) {
        try {
          const result = evaluate(newExpression, prev.angleMode)
          return {
            ...prev,
            expression: newExpression + '=',
            display: formatResult(result),
            isResult: true,
            error: null,
          }
        } catch (err) {
          return { ...prev, display: 'Error', isResult: true, error: err instanceof Error ? err.message : 'Error' }
        }
      }

      return {
        ...prev,
        expression: newExpression,
        display: '0',
        isResult: false,
      }
    })
  }, [])

  const handleConstant = useCallback((c: 'π' | 'e') => {
    setState(prev => {
      if (prev.error) return prev
      const value = c === 'π' ? Math.PI : Math.E
      if (prev.isResult) {
        return {
          ...prev,
          expression: '',
          display: formatResult(value),
          isResult: false,
        }
      }
      if (prev.expression && prev.expression.match(/[+\-*/^(]$/)) {
        return {
          ...prev,
          expression: prev.expression + c,
          display: formatResult(value),
          isResult: false,
        }
      }
      return {
        ...prev,
        expression: c,
        display: formatResult(value),
        isResult: false,
      }
    })
  }, [])

  const handleClear = useCallback(() => {
    setState(INITIAL_STATE)
  }, [])

  const handleClearEntry = useCallback(() => {
    setState(prev => {
      if (prev.error) return { ...prev, display: '0', error: null, isResult: false }
      if (prev.isResult) return INITIAL_STATE
      return { ...prev, display: '0', error: null }
    })
  }, [])

  const handleToggleSign = useCallback(() => {
    setState(prev => {
      if (prev.error || prev.display === '0') return prev
      const newDisplay = prev.display.startsWith('-')
        ? prev.display.slice(1)
        : '-' + prev.display
      return { ...prev, display: newDisplay }
    })
  }, [])

  const handlePercent = useCallback(() => {
    setState(prev => {
      if (prev.error) return prev
      try {
        const value = parseFloat(prev.display)
        const result = value / 100
        return { ...prev, display: formatResult(result) }
      } catch {
        return prev
      }
    })
  }, [])

  const handleAngleMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      angleMode: prev.angleMode === 'DEG' ? 'RAD' : 'DEG',
    }))
  }, [])

  return {
    state,
    handleDigit,
    handleOperator,
    handleScientific,
    handleEquals,
    handleClear,
    handleClearEntry,
    handleToggleSign,
    handlePercent,
    handleDecimal,
    handleAngleMode,
    handleConstant,
  }
}

function formatResult(value: number): string {
  if (!isFinite(value)) return 'Error'
  const str = value.toPrecision(12)
  const num = parseFloat(str)
  if (Math.abs(num) >= 1e12 || (Math.abs(num) < 1e-9 && num !== 0)) {
    return num.toExponential(6)
  }
  const result = String(parseFloat(num.toPrecision(10)))
  return result
}
