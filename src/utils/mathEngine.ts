export type AngleMode = 'DEG' | 'RAD'

export function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

export function toDeg(rad: number): number {
  return (rad * 180) / Math.PI
}

export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new Error('Factorial requires non-negative integer')
  if (n === 0 || n === 1) return 1
  if (n > 170) throw new Error('Factorial overflow')
  let result = 1
  for (let i = 2; i <= n; i++) result *= i
  return result
}

type Token =
  | { type: 'number'; value: number }
  | { type: 'operator'; value: string }
  | { type: 'function'; value: string }
  | { type: 'lparen' }
  | { type: 'rparen' }
  | { type: 'comma' }

function tokenize(expr: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  while (i < expr.length) {
    const ch = expr[i]
    if (ch === ' ') { i++; continue }

    if (/\d/.test(ch) || (ch === '.' && i + 1 < expr.length && /\d/.test(expr[i + 1]))) {
      let num = ''
      while (i < expr.length && (/\d/.test(expr[i]) || expr[i] === '.')) {
        num += expr[i++]
      }
      tokens.push({ type: 'number', value: parseFloat(num) })
      continue
    }

    if (ch === 'π') {
      tokens.push({ type: 'number', value: Math.PI })
      i++
      continue
    }

    if (ch === 'e' && (i + 1 >= expr.length || !/[a-z]/i.test(expr[i + 1]))) {
      tokens.push({ type: 'number', value: Math.E })
      i++
      continue
    }

    const functions = ['asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh', 'sin', 'cos', 'tan', 'sqrt', 'cbrt', 'log', 'ln', 'factorial', 'abs']
    let matchedFn: string | null = null
    for (const fn of functions) {
      if (expr.slice(i).startsWith(fn)) {
        matchedFn = fn
        break
      }
    }
    if (matchedFn) {
      tokens.push({ type: 'function', value: matchedFn })
      i += matchedFn.length
      continue
    }

    if ('+-*/^'.includes(ch)) {
      tokens.push({ type: 'operator', value: ch })
      i++
      continue
    }

    if (ch === '(') { tokens.push({ type: 'lparen' }); i++; continue }
    if (ch === ')') { tokens.push({ type: 'rparen' }); i++; continue }
    if (ch === ',') { tokens.push({ type: 'comma' }); i++; continue }

    throw new Error(`Unknown character: ${ch}`)
  }
  return tokens
}

const PRECEDENCE: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 }
const RIGHT_ASSOC = new Set(['^'])

function applyOp(op: string, b: number, a: number): number {
  switch (op) {
    case '+': return a + b
    case '-': return a - b
    case '*': return a * b
    case '/':
      if (b === 0) throw new Error('Division by zero')
      return a / b
    case '^': return Math.pow(a, b)
    default: throw new Error(`Unknown operator: ${op}`)
  }
}

function applyFn(fn: string, arg: number, angleMode: AngleMode): number {
  const toAngle = angleMode === 'DEG' ? (x: number) => toRad(x) : (x: number) => x
  const fromAngle = angleMode === 'DEG' ? (x: number) => toDeg(x) : (x: number) => x

  switch (fn) {
    case 'sin': return Math.sin(toAngle(arg))
    case 'cos': return Math.cos(toAngle(arg))
    case 'tan': {
      const radVal = toAngle(arg)
      const result = Math.tan(radVal)
      if (!isFinite(result)) throw new Error('tan undefined at this angle')
      return result
    }
    case 'asin': {
      if (arg < -1 || arg > 1) throw new Error('asin domain error')
      return fromAngle(Math.asin(arg))
    }
    case 'acos': {
      if (arg < -1 || arg > 1) throw new Error('acos domain error')
      return fromAngle(Math.acos(arg))
    }
    case 'atan': return fromAngle(Math.atan(arg))
    case 'sinh': return Math.sinh(arg)
    case 'cosh': return Math.cosh(arg)
    case 'tanh': return Math.tanh(arg)
    case 'log': {
      if (arg <= 0) throw new Error('log domain error')
      return Math.log10(arg)
    }
    case 'ln': {
      if (arg <= 0) throw new Error('ln domain error')
      return Math.log(arg)
    }
    case 'sqrt': {
      if (arg < 0) throw new Error('sqrt domain error')
      return Math.sqrt(arg)
    }
    case 'cbrt': return Math.cbrt(arg)
    case 'factorial': return factorial(arg)
    case 'abs': return Math.abs(arg)
    default: throw new Error(`Unknown function: ${fn}`)
  }
}

export function evaluate(expression: string, angleMode: AngleMode = 'DEG'): number {
  const expr = expression.trim()
  if (!expr) throw new Error('Empty expression')

  const tokens = tokenize(expr)

  const output: number[] = []
  const opStack: (string | { fn: string })[] = []

  const popOp = () => {
    const op = opStack.pop()
    if (!op) throw new Error('Mismatched parentheses')
    if (typeof op === 'object') {
      const arg = output.pop()
      if (arg === undefined) throw new Error('Missing argument')
      output.push(applyFn(op.fn, arg, angleMode))
    } else {
      const b = output.pop()
      const a = output.pop()
      if (a === undefined || b === undefined) throw new Error('Missing operand')
      output.push(applyOp(op, b, a))
    }
  }

  let expectUnary = true

  for (let idx = 0; idx < tokens.length; idx++) {
    const token = tokens[idx]

    if (token.type === 'number') {
      output.push(token.value)
      expectUnary = false
      continue
    }

    if (token.type === 'function') {
      opStack.push({ fn: token.value })
      expectUnary = true
      continue
    }

    if (token.type === 'lparen') {
      opStack.push('(')
      expectUnary = true
      continue
    }

    if (token.type === 'rparen') {
      while (opStack.length > 0 && opStack[opStack.length - 1] !== '(') {
        popOp()
      }
      if (opStack.length === 0) throw new Error('Mismatched parentheses')
      opStack.pop()
      if (opStack.length > 0 && typeof opStack[opStack.length - 1] === 'object') {
        popOp()
      }
      expectUnary = false
      continue
    }

    if (token.type === 'comma') {
      while (opStack.length > 0 && opStack[opStack.length - 1] !== '(') {
        popOp()
      }
      expectUnary = true
      continue
    }

    if (token.type === 'operator') {
      const op = token.value
      if (expectUnary && (op === '-' || op === '+')) {
        if (op === '-') {
          output.push(-1)
          opStack.push('*')
        }
        expectUnary = true
        continue
      }

      const prec = PRECEDENCE[op] ?? 0
      while (
        opStack.length > 0 &&
        opStack[opStack.length - 1] !== '(' &&
        typeof opStack[opStack.length - 1] === 'string' &&
        opStack[opStack.length - 1] !== '(' &&
        (PRECEDENCE[opStack[opStack.length - 1] as string] ?? 0) >= prec &&
        !RIGHT_ASSOC.has(op)
      ) {
        popOp()
      }
      opStack.push(op)
      expectUnary = true
      continue
    }
  }

  while (opStack.length > 0) {
    const top = opStack[opStack.length - 1]
    if (top === '(') throw new Error('Mismatched parentheses')
    popOp()
  }

  if (output.length !== 1) throw new Error('Invalid expression')

  const result = output[0]
  if (!isFinite(result)) throw new Error('Result is not finite')
  return result
}
