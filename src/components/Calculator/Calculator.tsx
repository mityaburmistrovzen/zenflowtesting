import { useCalculator } from '../../hooks/useCalculator'
import { Display } from '../Display/Display'
import { Button } from '../Button/Button'
import styles from './Calculator.module.css'

export default function Calculator() {
  const {
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
  } = useCalculator()

  return (
    <div className={styles.calculator} data-testid="calculator">
      <Display
        expression={state.expression}
        display={state.display}
        angleMode={state.angleMode}
        error={state.error}
      />

      <div className={styles.buttons}>
        <div className={styles.scientificRow}>
          <Button label={state.angleMode} onClick={handleAngleMode} variant="action" active data-testid="btn-angle" />
          <Button label="sin" onClick={() => handleScientific('sin')} variant="scientific" />
          <Button label="cos" onClick={() => handleScientific('cos')} variant="scientific" />
          <Button label="tan" onClick={() => handleScientific('tan')} variant="scientific" />
          <Button label="asin" onClick={() => handleScientific('asin')} variant="scientific" />
          <Button label="acos" onClick={() => handleScientific('acos')} variant="scientific" />
          <Button label="atan" onClick={() => handleScientific('atan')} variant="scientific" />
        </div>

        <div className={styles.scientificRow}>
          <Button label="log" onClick={() => handleScientific('log')} variant="scientific" />
          <Button label="ln" onClick={() => handleScientific('ln')} variant="scientific" />
          <Button label="√" onClick={() => handleScientific('sqrt')} variant="scientific" />
          <Button label="∛" onClick={() => handleScientific('cbrt')} variant="scientific" />
          <Button label="x²" onClick={() => handleScientific('x²')} variant="scientific" />
          <Button label="xʸ" onClick={() => handleScientific('xʸ')} variant="scientific" />
          <Button label="n!" onClick={() => handleScientific('n!')} variant="scientific" />
        </div>

        <div className={styles.scientificRow}>
          <Button label="π" onClick={() => handleConstant('π')} variant="scientific" />
          <Button label="e" onClick={() => handleConstant('e')} variant="scientific" />
          <Button label="(" onClick={() => handleOperator('(')} variant="operator" />
          <Button label=")" onClick={() => handleOperator(')')} variant="operator" />
          <Button label="CE" onClick={handleClearEntry} variant="action" data-testid="btn-ce" />
          <Button label="C" onClick={handleClear} variant="action" data-testid="btn-clear" />
          <Button label="±" onClick={handleToggleSign} variant="action" />
        </div>

        <div className={styles.mainGrid}>
          <Button label="%" onClick={handlePercent} variant="action" />
          <Button label="÷" onClick={() => handleOperator('/')} variant="operator" data-testid="btn-div" />
          <Button label="×" onClick={() => handleOperator('*')} variant="operator" />
          <Button label="−" onClick={() => handleOperator('-')} variant="operator" />

          <Button label="7" onClick={() => handleDigit('7')} variant="number" data-testid="btn-7" />
          <Button label="8" onClick={() => handleDigit('8')} variant="number" />
          <Button label="9" onClick={() => handleDigit('9')} variant="number" />
          <Button label="+" onClick={() => handleOperator('+')} variant="operator" data-testid="btn-plus" />

          <Button label="4" onClick={() => handleDigit('4')} variant="number" />
          <Button label="5" onClick={() => handleDigit('5')} variant="number" />
          <Button label="6" onClick={() => handleDigit('6')} variant="number" />
          <Button label="^" onClick={() => handleOperator('^')} variant="operator" />

          <Button label="1" onClick={() => handleDigit('1')} variant="number" data-testid="btn-1" />
          <Button label="2" onClick={() => handleDigit('2')} variant="number" data-testid="btn-2" />
          <Button label="3" onClick={() => handleDigit('3')} variant="number" />
          <Button label="=" onClick={handleEquals} variant="equals" data-testid="btn-equals" />

          <Button label="0" onClick={() => handleDigit('0')} variant="number" wide data-testid="btn-0" />
          <Button label="." onClick={handleDecimal} variant="number" />
        </div>
      </div>
    </div>
  )
}
