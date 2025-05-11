import { Assertion } from './Assertion.ts'
import { TestError } from './TestError.ts'
import { DescribeOptions, TestDescription, TestOptions, TestResult, TesterOptions } from './Tester.types.ts'

export class Tester {
  public readonly options: TesterOptions

  private tests: TestDescription[] = []
  private currentSpecPath: string[] = []
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
    
    // Execute the function to register nested tests and describes
    fn()
    
    // Remove the describe name from the path when we're done
    this.currentSpecPath.pop()
  }

  public test(name: string, fn: () => void | Promise<void>, options?: TestOptions) {
    this.tests.push({
      name,
      fn,
      options: options || {},
      specPath: [...this.currentSpecPath]
    })
  }

  public expect(value: any) {
    return new Assertion(value)
  }

  public async run() {
    this.testResults = []

    // Process tests based on their options and the tester's run order
    const testsToRun = [...this.tests]
    
    // Run each test
    for (const test of testsToRun) {
      await this.runTest(test)
    }

    return this.testResults
  }

  private async runTest(test: TestDescription) {
    try {
      await test.fn()
      
      // Format the spec as either a string (for top-level tests) or an array (for nested tests)
      const spec = test.specPath.length === 0 
        ? test.name 
        : [...test.specPath, test.name]
      
      this.testResults.push({
        spec,
        passed: true
      })
    } catch (error: unknown) {
      if (error instanceof TestError) {
        const spec = test.specPath.length === 0 
          ? test.name 
          : [...test.specPath, test.name]
        
        this.testResults.push({
          spec,
          error: error,
          passed: false
        })
        
        if (this.options.bail) {
          throw error
        }
      } else {
        throw error
      }
    }
  }
}
