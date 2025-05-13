import { Assertion } from './Assertion'
import { TestError } from './TestError'
import { DescribeOptions, TestDescription, TestOptions, TestResult, TesterOptions } from './Tester.types'
import { AnythingAssertion } from './asymentric-assertions/AnythingAssertion'
import { createMockFunction } from './createMockFunction'

export class Tester {
  public readonly options: TesterOptions

  private tests: TestDescription[] = []
  private currentSpecPath: string[] = []
  private currentDescribeOptions: DescribeOptions[] = []
  private testResults: TestResult[] = []

  public get not() {
    return {
      expectAnything: () => new AnythingAssertion(true)
    }
  }

  public get results() {
    return this.testResults
  }

  public constructor(options?: TesterOptions) {
    this.options = { bail: false, runOrder: 'sequence', timeout: 5000, ...options }
  }

  public mockFn() {
    return createMockFunction()
  }

  public expectAnything() {
    return new AnythingAssertion()
  }

  public describe(name: string | Function, fn: () => void, options?: DescribeOptions) {
    const descriptiveName = typeof name === 'string' ? name : name.name || 'Anonymous Function'

    // Push the describe name to the current path
    this.currentSpecPath.push(descriptiveName)

    // Push the describe options to the stack
    this.currentDescribeOptions.push(options || {})

    // Execute the function to register nested tests and describes
    fn()

    // Remove the describe options and name from the path when we're done
    this.currentDescribeOptions.pop()
    this.currentSpecPath.pop()
  }

  public test(name: string, fn: () => void | Promise<void>, options?: TestOptions) {
    // Merge options from describe blocks (from outer to inner)
    const mergedOptions: TestOptions = { timeout: this.options.timeout }

    // Apply describe options from outermost to innermost
    for (const describeOpts of this.currentDescribeOptions) {
      if (describeOpts.timeout !== undefined) mergedOptions.timeout = describeOpts.timeout
      if (describeOpts.only !== undefined) mergedOptions.only = describeOpts.only
      if (describeOpts.skip !== undefined) mergedOptions.skip = describeOpts.skip
      if (describeOpts.skipReason !== undefined) mergedOptions.skipReason = describeOpts.skipReason
    }

    // Test options take precedence over all describe options
    if (options) {
      Object.assign(mergedOptions, options)
    }

    this.tests.push({
      name,
      fn,
      options: mergedOptions,
      specPath: [...this.currentSpecPath]
    })
  }

  public expect(value: any) {
    return new Assertion(value)
  }

  public async run() {
    this.testResults = []

    // Check if any test has 'only' flag
    const hasOnlyTests = this.tests.some((test) => test.options.only)

    // Make a copy of the test array
    const testsToRun = [...this.tests]

    // Process tests based on their options and the tester's run order
    if (this.options.runOrder === 'random') {
      // Shuffle the array for random execution
      testsToRun.sort(() => Math.random() - 0.5)
    } else if (this.options.runOrder === 'parallel') {
      // For parallel execution, we'll pass the hasOnlyTests flag to runTest
      await Promise.all(testsToRun.map((test) => this.runTest(test, hasOnlyTests)))
      return this.testResults
    }

    // Run each test in sequence
    for (const test of testsToRun) {
      await this.runTest(test, hasOnlyTests)

      // If bail is enabled and a test has failed, stop execution
      if (this.options.bail && this.testResults.some((result) => !result.passed)) {
        break
      }
    }

    return this.testResults
  }

  private async runTest(test: TestDescription, hasOnlyTests: boolean) {
    // Determine if the test should be skipped
    const shouldSkip = test.options.skip || (hasOnlyTests && !test.options.only)
    const skipReason = test.options.skipReason || (hasOnlyTests && !test.options.only ? '"only" tests are active' : undefined)
    const spec = test.specPath.length === 0 ? test.name : [...test.specPath, test.name]

    // If the test should be skipped, record the result without executing
    if (shouldSkip) {
      this.testResults.push({
        spec,
        passed: true,
        options: test.options,
        skipped: true,
        skipReason: skipReason
      })
      return
    }

    // Set up timeout handling
    let timeoutId: NodeJS.Timeout | undefined

    try {
      // Create a promise that rejects after the timeout
      const timeoutPromise = new Promise<void>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(
            new TestError({
              message: `Test timed out after {{timeout}}ms`,
              messageLocals: {
                timeout: String(test.options.timeout)
              },
              expected: test.options.timeout,
              actual: 100000
            })
          )
        }, test.options.timeout)
      })

      // Race the test execution against the timeout
      await Promise.race([Promise.resolve().then(() => test.fn()), timeoutPromise])

      // If we get here, the test passed
      this.testResults.push({
        spec,
        passed: true,
        options: test.options
      })
    } catch (error: unknown) {
      if (error instanceof TestError) {
        this.testResults.push({
          spec,
          error: error,
          passed: false,
          options: test.options
        })

        if (this.options.bail) {
          throw error
        }
      } else {
        throw error
      }
    } finally {
      // Clear the timeout to prevent memory leaks
      if (timeoutId) clearTimeout(timeoutId)
    }
  }
}
