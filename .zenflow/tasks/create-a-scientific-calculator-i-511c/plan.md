# Spec and build

## Configuration
- **Artifacts Path**: {@artifacts_path} → `.zenflow/tasks/{task_id}`

---

## Agent Instructions

Ask the user questions when anything is unclear or needs their input. This includes:
- Ambiguous or incomplete requirements
- Technical decisions that affect architecture or user experience
- Trade-offs that require business context

Do not make assumptions on important decisions — get clarification first.

If you are blocked and need user clarification, mark the current step with `[!]` in plan.md before stopping.

---

## Workflow Steps

### [x] Step: Technical Specification
<!-- chat-id: 0c4a56c7-43d0-4ee8-a5b3-6da7742bc9f6 -->

Assess the task's difficulty, as underestimating it leads to poor outcomes.
- easy: Straightforward implementation, trivial bug fix or feature
- medium: Moderate complexity, some edge cases or caveats to consider
- hard: Complex logic, many caveats, architectural considerations, or high-risk changes

Create a technical specification for the task that is appropriate for the complexity level:
- Review the existing codebase architecture and identify reusable components.
- Define the implementation approach based on established patterns in the project.
- Identify all source code files that will be created or modified.
- Define any necessary data model, API, or interface changes.
- Describe verification steps using the project's test and lint commands.

Save the output to `{@artifacts_path}/spec.md` with:
- Technical context (language, dependencies)
- Implementation approach
- Source code structure changes
- Data model / API / interface changes
- Verification approach

If the task is complex enough, create a detailed implementation plan based on `{@artifacts_path}/spec.md`:
- Break down the work into concrete tasks (incrementable, testable milestones)
- Each task should reference relevant contracts and include verification steps
- Replace the Implementation step below with the planned tasks

Rule of thumb for step size: each step should represent a coherent unit of work (e.g., implement a component, add an API endpoint, write tests for a module). Avoid steps that are too granular (single function).

Important: unit tests must be part of each implementation task, not separate tasks. Each task should implement the code and its tests together, if relevant.

Save to `{@artifacts_path}/plan.md`. If the feature is trivial and doesn't warrant this breakdown, keep the Implementation step below as is.

---

### [x] Step: Project Scaffold

Set up the React + Vite + TypeScript project from scratch.
- Initialize with `npm create vite@latest . -- --template react-ts`
- Ensure `.gitignore` covers `node_modules/`, `dist/`, `.cache/`, `*.log`
- Install dependencies: `npm install`
- Install dev deps: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`
- Configure Vitest in `vite.config.ts` with `jsdom` environment
- Add `typecheck` script (`tsc --noEmit`) and `test` script to `package.json`
- Verify: `npm run lint` and `npm run typecheck` pass on empty scaffold

---

### [x] Step: Math Engine

Implement the expression evaluator and math utilities in `src/utils/mathEngine.ts`.
- Implement a safe expression evaluator (shunting-yard or recursive-descent) supporting `+`, `-`, `*`, `/`, `^`
- Support function calls: `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `log`, `ln`, `sqrt`, `cbrt`, `factorial`
- Support constants: `π`, `e`
- Respect `angleMode: 'DEG' | 'RAD'` for trig functions
- Handle errors gracefully (division by zero, domain errors, factorial of negative/non-integer)
- Write unit tests in `src/utils/mathEngine.test.ts` covering all operations, edge cases, and angle modes
- Verify: `npm run test` passes

---

### [x] Step: Calculator State Hook

Implement `src/hooks/useCalculator.ts` with all calculator state and input handling logic.
- Manage `CalculatorState` (expression, display, isResult, angleMode, error)
- Implement all handler functions as defined in spec.md
- Handle operator chaining, result → next operation flow, error recovery
- Write integration-level tests in `src/hooks/useCalculator.test.ts` (or co-locate with Calculator component tests)
- Verify: `npm run test` passes, `npm run typecheck` passes

---

### [x] Step: UI Components and Styling

Build and style all React components.
- `src/components/Button/Button.tsx` — reusable button with variants (`number`, `operator`, `scientific`, `action`, `equals`)
- `src/components/Display/Display.tsx` — shows expression history (top) and current value (bottom)
- `src/components/Calculator/Calculator.tsx` — layout of all button rows, wires up `useCalculator` hook
- CSS Modules for each component; responsive layout, dark/light theme optional but clean by default
- Write render/interaction tests in `Calculator.test.tsx` using React Testing Library
- Verify: `npm run test` passes, `npm run lint` passes, app renders in browser

---

### [x] Step: Final Verification and Report

Run all checks and write the implementation report.
- Run `npm run lint`, `npm run typecheck`, `npm run test` — all must pass
- Manually verify all calculator operations in browser
- Write report to `.zenflow/tasks/create-a-scientific-calculator-i-511c/report.md`

### [x] Step: Success criteria: The PR is approved by all reviewers and merged successfully. All CI checks pass.
<!-- chat-id: 3bce0d78-1f89-4cb8-8e89-a649bae5e0c5 -->
