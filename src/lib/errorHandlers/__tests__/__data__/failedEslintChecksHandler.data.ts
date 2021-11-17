import { ShellCommandExecutionError } from '../../../execShellCommand';

export const SINGLE = {
  error: new ShellCommandExecutionError(`> test-runner@0.0.0 lint /github/workspace
> eslint . && tsc --noEmit


/github/workspace/src/lib/version/version-base.ts
  66:5   error  Expected blank line before this statement  padding-line-between-statements
  66:30  error  Insert \`;\`                                 prettier/prettier
  67:5   error  Expected blank line before this statement  padding-line-between-statements

✖ 3 problems (3 errors, 0 warnings)
  3 errors and 0 warnings potentially fixable with the \`--fix\` option.`),
  message: '3 problems (3 errors, 0 warnings)',
};

export const MONOREPO = {
  error: new ShellCommandExecutionError(`ctv-shared: /github/workspace/packages/shared/pages/_app.tsx
ctv-shared:   14:9  warning  Do not include stylesheets manually. See: https://nextjs.org/docs/messages/no-css-tags  @next/next/no-css-tags
ctv-shared: /github/workspace/packages/shared/src/components/card-image/index.tsx
ctv-shared:   85:6  warning  React Hook useEffect has a missing dependency: 'placeholder'. Either include it or remove the dependency array. If 'setBase64Url' needs the current value of 'placeholder', you can also switch to useReducer instead of useState and read 'placeholder' in the reducer  react-hooks/exhaustive-deps
ctv-shared: /github/workspace/packages/shared/src/components/progress-bar/ProgressBar.tsx
ctv-shared:   9:3  warning  propType "colors" is not required, but has no corresponding defaultProps declaration  react/require-default-props
ctv-shared: /github/workspace/packages/shared/src/constants.ts
ctv-shared:   1:1  warning  Prefer default export  import/prefer-default-export
ctv-shared: ✖ 4 problems (0 errors, 4 warnings)
ctv-tve:   10:6  warning  React Hook useEffect has a missing dependency: 'dispatchStoreAction'. Either include it or remove the dependency array  react-hooks/exhaustive-deps
ctv-tve: /github/workspace/packages/tve/src/hooks/useShowError.ts
ctv-tve:   31:6  warning  React Hook useEffect has missing dependencies: 'logError' and 'showErrorMessage'. Either include them or remove the dependency array. If 'logError' changes too often, find the parent component that defines it and wrap that definition in useCallback  react-hooks/exhaustive-deps
ctv-tve: /github/workspace/packages/tve/src/layouts/fragments/center/index.tsx
ctv-tve:   14:32  warning  Must use destructuring props assignment  react/destructuring-assignment
ctv-tve: /github/workspace/packages/tve/src/layouts/fragments/scroll-area/index.tsx
ctv-tve:   22:8  warning  Must use destructuring props assignment  react/destructuring-assignment
ctv-tve: /github/workspace/packages/tve/src/layouts/fragments/scroll-target/index.tsx
ctv-tve:   11:3  warning  propType "topShiftRem" is not required, but has no corresponding defaultProps declaration  react/require-default-props
ctv-tve: /github/workspace/packages/tve/src/layouts/full/basic/index.tsx
ctv-tve:   21:26  warning  Must use destructuring props assignment  react/destructuring-assignment
ctv-tve: /github/workspace/packages/tve/src/layouts/full/full/index.tsx
ctv-tve:   9:67  warning  Must use destructuring props assignment  react/destructuring-assignment
ctv-tve: /github/workspace/packages/tve/src/platforms/index.ts
ctv-tve:   2:1  warning  Dependency cycle detected  import/no-cycle
ctv-tve:   3:1  warning  Dependency cycle detected  import/no-cycle
ctv-tve: /github/workspace/packages/tve/src/platforms/supported-platforms/desktop.ts
ctv-tve:   3:1  warning  Dependency cycle detected  import/no-cycle
ctv-tve: /github/workspace/packages/tve/src/platforms/supported-platforms/xfinity.ts
ctv-tve:   3:1  warning  Dependency cycle detected  import/no-cycle
ctv-tve: /github/workspace/packages/tve/src/store/index.ts
ctv-tve:   3:1  warning  Dependency cycle via src/analytics:1  import/no-cycle
ctv-tve: /github/workspace/packages/tve/types/index.ts
ctv-tve:   1:1  warning  Dependency cycle via src/store:13  import/no-cycle
ctv-tve: ✖ 405 problems (11 errors, 394 warnings)
ctv-tve: npm ERR! code ELIFECYCLE
ctv-tve: npm ERR! errno 1
ctv-tve: npm ERR! ctv-tve@0.0.20 lint: \`npx eslint . && tsc --noEmit\`
ctv-tve: npm ERR! Exit status 1
ctv-tve: npm ERR!
ctv-tve: npm ERR! Failed at the ctv-tve@0.0.20 lint script.
ctv-tve: npm ERR! This is probably not a problem with npm. There is likely additional logging output above.
ctv-tve: npm ERR! A complete log of this run can be found in:
ctv-tve: npm ERR!     /github/home/.npm/_logs/2021-11-17T19_30_11_908Z-debug.log
ctv-svod:   3:1  warning  Dependency cycle detected  import/no-cycle
ctv-svod: /github/workspace/packages/svod/src/platforms/supported-platforms/vizio.ts
ctv-svod:   3:1  warning  Dependency cycle detected  import/no-cycle
ctv-svod: /github/workspace/packages/svod/src/store/index.ts
ctv-svod:   3:1  warning  Dependency cycle via src/analytics:1  import/no-cycle
ctv-svod: /github/workspace/packages/svod/src/utils/dummytext.ts
ctv-svod:   1:1  warning  Prefer default export  import/prefer-default-export
ctv-svod: /github/workspace/packages/svod/src/utils/tile-card-mappers.ts
ctv-svod:   1:1  error  Run autofix to sort these imports!  simple-import-sort/imports
ctv-svod: /github/workspace/packages/svod/types/index.ts
ctv-svod:   1:1  warning  Dependency cycle via src/store:16  import/no-cycle
ctv-svod:   3:1  warning  Dependency cycle via src/store:3   import/no-cycle
ctv-svod: ✖ 436 problems (58 errors, 378 warnings)
ctv-svod:   57 errors and 0 warnings potentially fixable with the \`--fix\` option.
ctv-svod: npm ERR! code ELIFECYCLE
ctv-svod: npm ERR! errno 1
ctv-svod: npm ERR! ctv-svod@0.0.20 lint: \`npx eslint . && tsc --noEmit\`
ctv-svod: npm ERR! Exit status 1
ctv-svod: npm ERR!
ctv-svod: npm ERR! Failed at the ctv-svod@0.0.20 lint script.
ctv-svod: npm ERR! This is probably not a problem with npm. There is likely additional logging output above.
ctv-svod: npm ERR! A complete log of this run can be found in:
ctv-svod: npm ERR!     /github/home/.npm/_logs/2021-11-17T19_30_18_670Z-debug.log
lerna ERR! Received non-zero exit code 1 during execution
lerna success run Ran npm script 'lint' in 3 packages in 75.6s:
lerna success - ctv-shared
lerna success - ctv-svod
lerna success - ctv-tve
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! ctv@0.0.20 lint: \`npx eslint . && npx lerna run lint --parallel --no-bail\`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the ctv@0.0.20 lint script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /github/home/.npm/_logs/2021-11-17T19_30_18_706Z-debug.log`),
  message: `ctv-shared: 4 problems (0 errors, 4 warnings)
ctv-tve: 405 problems (11 errors, 394 warnings)
ctv-svod: 436 problems (58 errors, 378 warnings)`,
};
