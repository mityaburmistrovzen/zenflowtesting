# Technical Specification: Scientific Calculator in React

## Complexity Assessment
**Medium** — Standard UI components, state management, expression evaluation logic, and scientific math functions. No backend needed; pure frontend app.

---

## Technical Context

- **Language**: TypeScript
- **Framework**: React 18 with Vite
- **Styling**: CSS Modules (no external UI library)
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + TypeScript strict mode

---

## Implementation Approach

A single-page React app with:
1. A display showing the current input/result
2. A button grid with basic and scientific operations
3. A pure calculation engine (no `eval`) using a proper expression parser

### Calculator Features

**Basic operations**: `+`, `-`, `×`, `÷`, `=`, `C`, `CE`, `±`, `%`, `.`

**Scientific operations**:
- Trigonometry: `sin`, `cos`, `tan`, `asin`, `acos`, `atan`
- Logarithms: `log` (base 10), `ln` (natural)
- Power/root: `x²`, `xʸ`, `√`, `∛`
- Constants: `π`, `e`
- Factorial: `n!`
- Angle mode toggle: `DEG` / `RAD`

**Display**: Shows expression history (top row, smaller) and current value (bottom row, large)

---

## Source Code Structure

```
/
├── .gitignore
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── App.module.css
    ├── components/
    │   ├── Calculator/
    │   │   ├── Calculator.tsx          # Root calculator component
    │   │   ├── Calculator.module.css
    │   │   ├── Calculator.test.tsx     # Integration tests
    │   ├── Display/
    │   │   ├── Display.tsx             # Expression + result display
    │   │   └── Display.module.css
    │   └── Button/
    │       ├── Button.tsx              # Reusable button with variants
    │       └── Button.module.css
    ├── hooks/
    │   └── useCalculator.ts            # All calculator state logic
    └── utils/
        ├── mathEngine.ts               # Expression parser & evaluator
        └── mathEngine.test.ts          # Unit tests for math engine
```

---

## Data Model / State

```typescript
interface CalculatorState {
  expression: string;      // The full expression string displayed top
  display: string;         // Current number/result shown large
  isResult: boolean;       // Whether display shows a computed result
  angleMode: 'DEG' | 'RAD';
  error: string | null;
}
```

### `useCalculator` hook API

```typescript
const {
  state,
  handleDigit,       // (digit: string) => void
  handleOperator,    // (op: string) => void
  handleScientific,  // (fn: string) => void
  handleEquals,      // () => void
  handleClear,       // () => void
  handleClearEntry,  // () => void
  handleToggleSign,  // () => void
  handlePercent,     // () => void
  handleDecimal,     // () => void
  handleAngleMode,   // () => void
  handleConstant,    // (c: 'π' | 'e') => void
} = useCalculator();
```

### Math Engine (`mathEngine.ts`)

- `evaluate(expression: string, angleMode: 'DEG' | 'RAD'): number` — Evaluates a mathematical expression string safely (using a recursive-descent parser or `mathjs` if available — check package.json first; otherwise implement simple shunting-yard algorithm for `+`, `-`, `*`, `/`, `^` with function support)
- `factorial(n: number): number`
- `toRad(deg: number): number`

---

## Verification Approach

### Tests
```bash
npm run test        # Vitest unit + integration tests
```

Key test cases:
- Basic arithmetic: `2 + 3 = 5`
- Chained operations: `5 × 3 - 2 = 13`
- Scientific: `sin(90)` in DEG mode = `1`
- Edge cases: division by zero → "Error", factorial of negative → "Error"
- Display updates correctly on digit press

### Lint / Typecheck
```bash
npm run lint
npm run typecheck   # or tsc --noEmit
```

### Manual Verification
- Open browser, verify all button rows render
- Test basic arithmetic flow
- Test scientific functions (sin, cos, log)
- Toggle DEG/RAD and verify sin(π/2 RAD) = 1
- Verify `C` clears all, `CE` clears current entry
