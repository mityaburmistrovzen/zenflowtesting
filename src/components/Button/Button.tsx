import styles from './Button.module.css'

export type ButtonVariant = 'number' | 'operator' | 'scientific' | 'action' | 'equals'

interface ButtonProps {
  label: string
  onClick: () => void
  variant?: ButtonVariant
  wide?: boolean
  disabled?: boolean
  active?: boolean
  'data-testid'?: string
}

export function Button({ label, onClick, variant = 'number', wide = false, disabled = false, active = false, 'data-testid': testId }: ButtonProps) {
  return (
    <button
      className={[
        styles.button,
        styles[variant],
        wide ? styles.wide : '',
        active ? styles.active : '',
      ].filter(Boolean).join(' ')}
      onClick={onClick}
      disabled={disabled}
      type="button"
      data-testid={testId}
    >
      {label}
    </button>
  )
}
