import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Calculator from './Calculator'

function getDisplay() {
  return screen.getByLabelText('display').textContent ?? ''
}

function getExpression() {
  return screen.getByLabelText('expression').textContent ?? ''
}

function click(label: string) {
  const elements = screen.getAllByText(label)
  const btn = elements.find(el => el.tagName === 'BUTTON') ?? elements[0]
  fireEvent.click(btn)
}

describe('Calculator rendering', () => {
  it('renders the display', () => {
    render(<Calculator />)
    expect(screen.getByLabelText('display')).toBeTruthy()
  })

  it('shows 0 initially', () => {
    render(<Calculator />)
    expect(getDisplay()).toBe('0')
  })

  it('renders digit buttons', () => {
    render(<Calculator />)
    expect(screen.getByText('1')).toBeTruthy()
    expect(screen.getByText('5')).toBeTruthy()
    expect(screen.getByText('9')).toBeTruthy()
  })

  it('renders scientific function buttons', () => {
    render(<Calculator />)
    expect(screen.getByText('sin')).toBeTruthy()
    expect(screen.getByText('cos')).toBeTruthy()
    expect(screen.getByText('log')).toBeTruthy()
    expect(screen.getByText('√')).toBeTruthy()
  })

  it('shows DEG mode by default', () => {
    render(<Calculator />)
    const angleBtns = screen.getAllByText('DEG')
    expect(angleBtns.length).toBeGreaterThan(0)
  })
})

describe('Calculator interactions - basic', () => {
  it('pressing 5 shows 5 on display', () => {
    render(<Calculator />)
    click('5')
    expect(getDisplay()).toBe('5')
  })

  it('2 + 3 = 5', () => {
    render(<Calculator />)
    click('2')
    click('+')
    click('3')
    click('=')
    expect(getDisplay()).toBe('5')
  })

  it('C clears to 0', () => {
    render(<Calculator />)
    click('5')
    click('C')
    expect(getDisplay()).toBe('0')
    expect(getExpression()).toBe('\u00a0')
  })

  it('shows expression history', () => {
    render(<Calculator />)
    click('4')
    click('+')
    click('2')
    click('=')
    expect(getExpression()).toContain('=')
  })
})

describe('Calculator interactions - scientific', () => {
  it('sin button on result evaluates sin(result)', () => {
    render(<Calculator />)
    click('9')
    click('0')
    click('=')
    click('sin')
    expect(getDisplay()).toBe('1')
  })

  it('toggles angle mode to RAD', () => {
    render(<Calculator />)
    click('DEG')
    const radBtns = screen.getAllByText('RAD')
    expect(radBtns.length).toBeGreaterThan(0)
  })

  it('π button inserts pi', () => {
    render(<Calculator />)
    click('π')
    expect(parseFloat(getDisplay())).toBeCloseTo(Math.PI, 4)
  })

  it('division by zero shows Error', () => {
    render(<Calculator />)
    click('1')
    click('÷')
    click('0')
    click('=')
    expect(getDisplay()).toBe('Error')
  })

  it('CE clears current entry', () => {
    render(<Calculator />)
    click('5')
    click('+')
    click('3')
    click('CE')
    expect(getDisplay()).toBe('0')
  })
})
