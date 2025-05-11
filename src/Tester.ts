import { Assertion } from './Assertion.ts'
import { TestError } from './TestError.ts'
import { DescribeOptions, TestDescription, TestOptions, TestResult, TesterOptions } from './Tester.types.ts'

export class Tester {
  public readonly options: TesterOptions

  private tests: TestDescription[] = []
  private currentSpecPath: string[] = []
  private currentDescribeOptions: DescribeOptions[] = []
  private testResults: TestResult[] = []

  public get results() {
    return this.testResults
  }

  public constructor(options?: TesterOptions) {
    this.options = { bail: false, runOrder: 'sequence', timeout: 5000, ...options }
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
      // For parallel execution, we need to prepare the tests first to handle 'only' and 'skip'
      const preparedTests = testsToRun.map((test) => {
        // If some tests have 'only' and this one doesn't, mark it as skipped
        if (hasOnlyTests && !test.options.only) {
          return {
            ...test,
            options: {
              ...test.options,
              skip: true,
              skipReason: '"only" tests are active'
            }
          }
        }
        return test
      })

      // Run tests in parallel
      await Promise.all(preparedTests.map((test) => this.runTest(test)))
      return this.testResults
    }

    // Run each test in sequence
    for (const test of testsToRun) {
      // If some tests have 'only' and this one doesn't, mark it as skipped
      const shouldSkip = test.options.skip || (hasOnlyTests && !test.options.only)
      const skipReason = test.options.skipReason || (hasOnlyTests && !test.options.only ? '"only" tests are active' : undefined)

      if (shouldSkip) {
        // Skip the test and record the result
        const spec = test.specPath.length === 0 ? test.name : [...test.specPath, test.name]
        this.testResults.push({
          spec,
          passed: true,
          options: test.options,
          skipped: true,
          skipReason: skipReason
        })
        continue
      }

      await this.runTest(test)
    }

    return this.testResults
  }

  private async runTest(test: TestDescription) {
    // Set up timeout handling
    let timeoutId: NodeJS.Timeout | undefined

    try {
      // Create a promise that rejects after the timeout
      const timeoutPromise = new Promise<void>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(
            new TestError({
              message: `Test timed out after ${test.options.timeout}ms`,
              expected: 'test to complete within timeout',
              actual: `test exceeded timeout of ${test.options.timeout}ms`
            })
          )
        }, test.options.timeout)
      })

      // Race the test execution against the timeout
      await Promise.race([Promise.resolve().then(() => test.fn()), timeoutPromise])

      // If we get here, the test passed
      const spec = test.specPath.length === 0 ? test.name : [...test.specPath, test.name]

      this.testResults.push({
        spec,
        passed: true,
        options: test.options
      })
    } catch (error: unknown) {
      if (error instanceof TestError) {
        const spec = test.specPath.length === 0 ? test.name : [...test.specPath, test.name]

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
