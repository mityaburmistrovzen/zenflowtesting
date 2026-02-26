import styles from './Display.module.css'

interface DisplayProps {
  expression: string
  display: string
  angleMode: 'DEG' | 'RAD'
  error: string | null
}

export function Display({ expression, display, angleMode, error }: DisplayProps) {
  const displayValue = error ? 'Error' : display

  const fontSize = displayValue.length > 12
    ? '1.4rem'
    : displayValue.length > 9
      ? '1.8rem'
      : '2.4rem'

  return (
    <div className={styles.display}>
      <div className={styles.angleMode}>{angleMode}</div>
      <div className={styles.expression} aria-label="expression" data-testid="expression">
        {expression || '\u00a0'}
      </div>
      <div
        className={`${styles.value} ${error ? styles.error : ''}`}
        style={{ fontSize }}
        aria-label="display"
        aria-live="polite"
        data-testid="display-value"
      >
        {displayValue}
      </div>
    </div>
  )
}
