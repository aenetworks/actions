import { ShellCommandExecutionError } from '../../../execShellCommand';

export const MONOREPO_FAILED = {
  error: new ShellCommandExecutionError(`lerna notice cli v4.0.0
lerna info ci enabled
lerna notice filter including "ctv-shared"
lerna info filter [ 'ctv-shared' ]
lerna info Executing command in 1 package: "npm run build"
lerna info run Ran npm script 'build' in 'ctv-shared' in 9.4s:
lerna success run Ran npm script 'build' in 1 package in 9.4s:
lerna success - ctv-shared
lerna notice cli v4.0.0
lerna info ci enabled
lerna info Executing command in 3 packages: "npm run test"
ctv-svod: PASS src/utils/duration-format/duration-format.test.ts
ctv-svod:   ✓ durationFormat formats correctly undefined (1 ms)
ctv-svod:   ✓ durationFormat formats correctly empty string (1 ms)
ctv-svod:   ✓ durationFormat formats correctly null
ctv-svod:   ✓ durationFormat formats correctly object
ctv-svod:   ✓ durationFormat formats correctly 0 seconds
ctv-svod:   ✓ durationFormat formats correctly 1 second
ctv-svod:   ✓ durationFormat formats correctly 30 seconds (1 ms)
ctv-svod:   ✓ durationFormat formats correctly 60 seconds
ctv-svod:   ✓ durationFormat formats correctly 3600 seconds
ctv-svod:   ✓ durationFormat formats correctly 7199 seconds (1 ms)
ctv-svod:   ✓ durationFormat formats correctly 30 seconds when durationSeconds is 3600s
ctv-svod:   ✓ durationFormat formats correctly 3601 seconds when durationSeconds is 3600s
ctv-tve: PASS src/utils/duration-format/duration-format.test.ts
ctv-tve:   ✓ durationFormat formats correctly undefined (2 ms)
ctv-tve:   ✓ durationFormat formats correctly empty string
ctv-tve:   ✓ durationFormat formats correctly null (1 ms)
ctv-tve:   ✓ durationFormat formats correctly object
ctv-tve:   ✓ durationFormat formats correctly 0 seconds
ctv-tve:   ✓ durationFormat formats correctly 1 second (1 ms)
ctv-tve:   ✓ durationFormat formats correctly 30 seconds
ctv-tve:   ✓ durationFormat formats correctly 60 seconds (3 ms)
ctv-tve:   ✓ durationFormat formats correctly 3600 seconds
ctv-tve:   ✓ durationFormat formats correctly 7199 seconds
ctv-tve:   ✓ durationFormat formats correctly 30 seconds when durationSeconds is 3600s
ctv-tve:   ✓ durationFormat formats correctly 3601 seconds when durationSeconds is 3600s
ctv-tve: FAIL src/components/circle-button/circle-button.test.tsx
ctv-tve:   Circle Button component
ctv-tve:     ✕ renders correctly (18 ms)
ctv-tve:   ● Circle Button component › renders correctly
ctv-tve:     expect(received).toMatchSnapshot()
ctv-tve:     Snapshot name: \`Circle Button component renders correctly 1\`
ctv-tve:     - Snapshot  - 1
ctv-tve:     + Received  + 1
ctv-tve:     @@ -1,7 +1,7 @@
ctv-tve:       <div
ctv-tve:     -   className="circle-button__Wrapper-sc-ov37bu-0 jzQFdU"
ctv-tve:     +   className="circle-button__Wrapper-sc-xvi7q8-0 liEmcI"
ctv-tve:         onBlur={[Function]}
ctv-tve:         onClick={[Function]}
ctv-tve:         onFocus={[Function]}
ctv-tve:         onKeyDown={[Function]}
ctv-tve:         tabIndex={0}
ctv-tve:        9 |     const button = shallowWithTheme(<CircleButton icon={SvgIconKey} title="Test button" />);
ctv-tve:       10 |
ctv-tve:     > 11 |     expect(button.dive()).toMatchSnapshot();
ctv-tve:          |                           ^
ctv-tve:       12 |   });
ctv-tve:       13 | });
ctv-tve:       14 |
ctv-tve:       at Object.<anonymous> (src/components/circle-button/circle-button.test.tsx:11:27)
ctv-tve:  › 1 snapshot failed.
ctv-svod: FAIL src/components/hero/model.test.ts
ctv-svod:   hero - model
ctv-svod:     focusBehavior
ctv-svod:       ✕ resets navState if element is first (2 ms)
ctv-svod:   ● hero - model › focusBehavior › resets navState if element is first
ctv-svod:     expect(jest.fn()).toBeCalledWith(...expected)
ctv-svod:     Expected: 0
ctv-svod:     Number of calls: 0
ctv-svod:       12 |
ctv-svod:       13 |       focusBehavior(mock);
ctv-svod:     > 14 |       expect(setter).toBeCalledWith(0);
ctv-svod:          |                      ^
ctv-svod:       15 |     });
ctv-svod:       16 |   });
ctv-svod:       17 | });
ctv-svod:       at Object.<anonymous> (src/components/hero/model.test.ts:14:22)
ctv-svod: FAIL src/components/circle-button/circle-button.test.tsx
ctv-svod:   Circle Button component
ctv-svod:     ✕ renders correctly (17 ms)
ctv-svod:   ● Circle Button component › renders correctly
ctv-svod:     expect(received).toMatchSnapshot()
ctv-svod:     Snapshot name: \`Circle Button component renders correctly 1\`
ctv-svod:     - Snapshot  - 1
ctv-svod:     + Received  + 2
ctv-svod:     @@ -1,17 +1,18 @@
ctv-svod:       <div
ctv-svod:     -   className="circle-button__Wrapper-ov37bu-0 fkjbnt"
ctv-svod:     +   className="circle-button__Wrapper-sc-u5nnjt-0 cGuUdr"
ctv-svod:         onBlur={[Function]}
ctv-svod:         onClick={[Function]}
ctv-svod:         onFocus={[Function]}
ctv-svod:         onKeyDown={[Function]}
ctv-svod:         tabIndex={0}
ctv-svod:       >
ctv-svod:         <circle-button__Button
ctv-svod:           backgroundColor="button"
ctv-svod:           focused={false}
ctv-svod:           focusedBackgroundColor="buttonFocused"
ctv-svod:     +     focusedIconColor="buttonIconFocused"
ctv-svod:           iconColor="buttonIcon"
ctv-svod:           size="6.6rem"
ctv-svod:         >
ctv-svod:           <SvgIconKey
ctv-svod:             height="2.6em"
ctv-svod:        9 |     const button = shallowWithTheme(<CircleButton icon={SvgIconKey} title="Test button" />);
ctv-svod:       10 |
ctv-svod:     > 11 |     expect(button.dive()).toMatchSnapshot();
ctv-svod:          |                           ^
ctv-svod:       12 |   });
ctv-svod:       13 | });
ctv-svod:       14 |
ctv-svod:       at Object.<anonymous> (src/components/circle-button/circle-button.test.tsx:11:27)
ctv-svod:  › 1 snapshot failed.
ctv-tve: FAIL src/components/button/button.test.tsx
ctv-tve:   Button component
ctv-tve:     ✕ renders correctly (49 ms)
ctv-tve:   ● Button component › renders correctly
ctv-tve:     expect(received).toMatchSnapshot()
ctv-tve:     Snapshot name: \`Button component renders correctly 1\`
ctv-tve:     - Snapshot  - 1
ctv-tve:     + Received  + 1
ctv-tve:     @@ -2,11 +2,11 @@
ctv-tve:         <button__ButtonStyled
ctv-tve:           onKeyDown={[Function]}
ctv-tve:           tabIndex={0}
ctv-tve:         >
ctv-tve:           <div
ctv-tve:     -       className="button__ButtonStyled-sc-qb6dz5-0 dclUCd"
ctv-tve:     +       className="button__ButtonStyled-sc-1ggmpwu-0 bwAXYy"
ctv-tve:             onKeyDown={[Function]}
ctv-tve:             tabIndex={0}
ctv-tve:           >
ctv-tve:             Test button
ctv-tve:           </div>
ctv-tve:       11 |     const button = mountWithTheme(<Button>Test button</Button>);
ctv-tve:       12 |
ctv-tve:     > 13 |     expect(button).toMatchSnapshot();
ctv-tve:          |                    ^
ctv-tve:       14 |   });
ctv-tve:       15 | });
ctv-tve:       16 |
ctv-tve:       at Object.<anonymous> (src/components/button/button.test.tsx:13:20)
ctv-tve:  › 1 snapshot failed.
ctv-tve: PASS src/utils/id-generator/id-generator.test.ts
ctv-tve:   idGenerator helper
ctv-tve:     ✓ idGenerator should return different value each time it is called
ctv-tve: Snapshot Summary
ctv-tve:  › 2 snapshots failed from 2 test suites. Inspect your code changes or run \`npm test -- -u\` to update them.
ctv-tve: Test Suites: 2 failed, 2 passed, 4 total
ctv-tve: Tests:       2 failed, 13 passed, 15 total
ctv-tve: Snapshots:   2 failed, 2 total
ctv-tve: Time:        5.172 s
ctv-tve: Ran all test suites.
ctv-tve: npm ERR! code ELIFECYCLE
ctv-tve: npm ERR! errno 1
ctv-tve: npm ERR! ctv-tve@0.0.20 test: \`npx jest\`
ctv-tve: npm ERR! Exit status 1
ctv-tve: npm ERR!
ctv-tve: npm ERR! Failed at the ctv-tve@0.0.20 test script.
ctv-tve: npm ERR! This is probably not a problem with npm. There is likely additional logging output above.
ctv-tve: npm ERR! A complete log of this run can be found in:
ctv-tve: npm ERR!     /github/home/.npm/_logs/2021-11-17T19_28_31_291Z-debug.log
ctv-svod: FAIL src/components/button/button.test.tsx
ctv-svod:   Button component
ctv-svod:     ✕ renders correctly (54 ms)
ctv-svod:   ● Button component › renders correctly
ctv-svod:     expect(received).toMatchSnapshot()
ctv-svod:     Snapshot name: \`Button component renders correctly 1\`
ctv-svod:     - Snapshot  - 1
ctv-svod:     + Received  + 1
ctv-svod:     @@ -2,11 +2,11 @@
ctv-svod:         <button__ButtonStyled
ctv-svod:           onKeyDown={[Function]}
ctv-svod:           tabIndex={0}
ctv-svod:         >
ctv-svod:           <div
ctv-svod:     -       className="button__ButtonStyled-qb6dz5-0 ItaLQ"
ctv-svod:     +       className="button__ButtonStyled-sc-18pu50-0 dhpghR"
ctv-svod:             onKeyDown={[Function]}
ctv-svod:             tabIndex={0}
ctv-svod:           >
ctv-svod:             Test button
ctv-svod:           </div>
ctv-svod:       11 |     const button = mountWithTheme(<Button>Test button</Button>);
ctv-svod:       12 |
ctv-svod:     > 13 |     expect(button).toMatchSnapshot();
ctv-svod:          |                    ^
ctv-svod:       14 |   });
ctv-svod:       15 | });
ctv-svod:       16 |
ctv-svod:       at Object.<anonymous> (src/components/button/button.test.tsx:13:20)
ctv-svod:  › 1 snapshot failed.
ctv-svod: PASS src/utils/id-generator/id-generator.test.ts
ctv-svod:   idGenerator helper
ctv-svod:     ✓ idGenerator should return different value each time it is called (1 ms)
ctv-svod: Snapshot Summary
ctv-svod:  › 2 snapshots failed from 2 test suites. Inspect your code changes or run \`npm test -- -u\` to update them.
ctv-svod: Test Suites: 3 failed, 2 passed, 5 total
ctv-svod: Tests:       3 failed, 13 passed, 16 total
ctv-svod: Snapshots:   2 failed, 2 total
ctv-svod: Time:        5.73 s
ctv-svod: Ran all test suites.
ctv-svod: npm ERR! code ELIFECYCLE
ctv-svod: npm ERR! errno 1
ctv-svod: npm ERR! ctv-svod@0.0.20 test: \`npx jest\`
ctv-svod: npm ERR! Exit status 1
ctv-svod: npm ERR!
ctv-svod: npm ERR! Failed at the ctv-svod@0.0.20 test script.
ctv-svod: npm ERR! This is probably not a problem with npm. There is likely additional logging output above.
ctv-svod: npm ERR! A complete log of this run can be found in:
ctv-svod: npm ERR!     /github/home/.npm/_logs/2021-11-17T19_28_31_777Z-debug.log
lerna ERR! Received non-zero exit code 1 during execution
lerna success run Ran npm script 'test' in 3 packages in 6.9s:
lerna success - ctv-shared
lerna success - ctv-svod
lerna success - ctv-tve
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! ctv@0.0.20 test: \`npx lerna run test --parallel --no-bail\`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the ctv@0.0.20 test script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /github/home/.npm/_logs/2021-11-17T19_28_31_806Z-debug.log
`),
  message: `ctv-tve: Test Suites: 2 failed, 2 passed, 4 total
ctv-tve: Tests:       2 failed, 13 passed, 15 total
ctv-tve: Snapshots:   2 failed, 2 total

ctv-svod: Test Suites: 3 failed, 2 passed, 5 total
ctv-svod: Tests:       3 failed, 13 passed, 16 total
ctv-svod: Snapshots:   2 failed, 2 total`,
};

export const SINGLE_REPO_FAILED = {
  error: new ShellCommandExecutionError(`FAIL src/lib/errorHandlers/__tests__/__data__/failedJestTestHandler.data.ts
  ● Test suite failed to run

    Your test suite must contain at least one test.

      at onResult (node_modules/@jest/core/build/TestScheduler.js:175:18)
      at node_modules/@jest/core/build/TestScheduler.js:316:17
      at node_modules/emittery/index.js:260:13
          at Array.map (<anonymous>)
      at Emittery.emit (node_modules/emittery/index.js:258:23)

PASS src/lib/version/__tests__/version.test.ts
PASS src/lib/errorHandlers/__tests__/failedJestTestsHandler.test.ts

Test Suites: 1 failed, 2 passed, 3 total
Tests:       23 passed, 23 total
Snapshots:   0 total
Time:        3.083 s
Ran all test suites.
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! test-runner@0.0.0 test: \`npx jest\`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the test-runner@0.0.0 test script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /github/home/.npm/_logs/2021-11-17T20_58_53_415Z-debug.log`),
  message: `Test Suites: 1 failed, 2 passed, 3 total
Tests:       23 passed, 23 total
Snapshots:   0 total`,
};
