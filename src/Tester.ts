import { Assertion } from './Assertion'
import { TestError } from './TestError'
import { DescribeOptions, LifecycleHook, TestDescription, TestOptions, TestResult, TesterOptions } from './Tester.types'
import { AnythingAssertion } from './asymmetric-assertions/AnythingAssertion'
import { CloseToAssertion } from './asymmetric-assertions/CloseToAssertion'
import { ContainAssertion } from './asymmetric-assertions/ContainAssertion'
import { ContainEqualAssertion } from './asymmetric-assertions/ContainEqualAssertion'
import { FalsyAssertion } from './asymmetric-assertions/FalsyAssertion'
import { GreaterThanAssertion } from './asymmetric-assertions/GreaterThanAssertion'
import { GreaterThanOrEqualAssertion } from './asymmetric-assertions/GreaterThanOrEqualAssertion'
import { HaveLengthAssertion } from './asymmetric-assertions/HaveLengthAssertion'
import { HavePropertyAssertion } from './asymmetric-assertions/HavePropertyAssertion'
import { InstanceOfAssertion } from './asymmetric-assertions/InstanceOfAssertion'
import { LessThanAssertion } from './asymmetric-assertions/LessThanAssertion'
import { LessThanOrEqualAssertion } from './asymmetric-assertions/LessThanOrEqualAssertion'
import { MatchAssertion } from './asymmetric-assertions/MatchAssertion'
import { MatchObjectAssertion } from './asymmetric-assertions/MatchObjectAssertion'
import { TruthyAssertion } from './asymmetric-assertions/TruthyAssertion'
import { createMockFunction } from './createMockFunction'
import { spyOn } from './spyOn'
import { SpyFn } from './spyOn.types'

export class Tester {
  public readonly options: TesterOptions

  private tests: TestDescription[] = []
  private currentSpecPath: string[] = []
  private currentDescribeOptions: DescribeOptions[] = []
  private testResults: TestResult[] = []
  private beforeHooks: LifecycleHook[] = []
  private beforeEachHooks: LifecycleHook[] = []
  private afterHooks: LifecycleHook[] = []
  private afterEachHooks: LifecycleHook[] = []

  public get not() {
    return {
      expectAnything: () => new AnythingAssertion(true),
      expectCloseTo: (value: number, precision?: number) => new CloseToAssertion(value, precision, true),
      expectContain: (item: any) => new ContainAssertion(item, true),
      expectContainEqual: (item: any) => new ContainEqualAssertion(item, true),
      expectFalsy: () => new FalsyAssertion(true),
      expectGreaterThan: (value: number) => new GreaterThanAssertion(value, true),
      expectGreaterThanOrEqual: (value: number) => new GreaterThanOrEqualAssertion(value, true),
      expectHaveLength: (length: number) => new HaveLengthAssertion(length, true),
      expectHaveProperty: (path: string, value?: any) => {
        if (arguments.length === 1) {
          return new HavePropertyAssertion(path, true)
        }
        return new HavePropertyAssertion(path, true, value)
      },
      expectInstanceOf: (constructor: Function) => new InstanceOfAssertion(constructor, true),
      expectLessThan: (value: number) => new LessThanAssertion(value, true),
      expectLessThanOrEqual: (value: number) => new LessThanOrEqualAssertion(value, true),
      expectMatch: (pattern: RegExp) => new MatchAssertion(pattern, true),
      expectMatchObject: (obj: Record<string, any>) => new MatchObjectAssertion(obj, true),
      expectTruthy: () => new TruthyAssertion(true)
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

  public spyOn(object: any, propertyPath: string): SpyFn {
    return spyOn(object, propertyPath)
  }

  public before(callback: () => void | Promise<void>) {
    this.beforeHooks.push({
      fn: callback,
      specPath: [...this.currentSpecPath]
    })
  }

  public beforeEach(callback: () => void | Promise<void>) {
    this.beforeEachHooks.push({
      fn: callback,
      specPath: [...this.currentSpecPath]
    })
  }

  public after(callback: () => void | Promise<void>) {
    this.afterHooks.push({
      fn: callback,
      specPath: [...this.currentSpecPath]
    })
  }

  public afterEach(callback: () => void | Promise<void>) {
    this.afterEachHooks.push({
      fn: callback,
      specPath: [...this.currentSpecPath]
    })
  }

  public expectAnything() {
    return new AnythingAssertion()
  }

  public expectGreaterThan(value: number) {
    return new GreaterThanAssertion(value)
  }

  public expectLessThan(value: number) {
    return new LessThanAssertion(value)
  }

  public expectGreaterThanOrEqual(value: number) {
    return new GreaterThanOrEqualAssertion(value)
  }

  public expectLessThanOrEqual(value: number) {
    return new LessThanOrEqualAssertion(value)
  }

  public expectMatch(pattern: RegExp) {
    return new MatchAssertion(pattern)
  }

  public expectInstanceOf(constructor: Function) {
    return new InstanceOfAssertion(constructor)
  }

  public expectCloseTo(value: number, precision?: number) {
    return new CloseToAssertion(value, precision)
  }

  public expectContain(item: any) {
    return new ContainAssertion(item)
  }

  public expectContainEqual(item: any) {
    return new ContainEqualAssertion(item)
  }

  public expectHaveLength(length: number) {
    return new HaveLengthAssertion(length)
  }

  public expectHaveProperty(path: string, value?: any) {
    if (arguments.length === 1) {
      return new HavePropertyAssertion(path, false)
    }
    return new HavePropertyAssertion(path, false, value)
  }

  public expectMatchObject(obj: Record<string, any>) {
    return new MatchObjectAssertion(obj)
  }

  public expectTruthy() {
    return new TruthyAssertion()
  }

  public expectFalsy() {
    return new FalsyAssertion()
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

    // Build a tree structure to represent the test hierarchy
    const testTree = this.buildTestTree(testsToRun)
    
    // Execute the test tree
    await this.executeTestTree(testTree, hasOnlyTests)

    return this.testResults
  }

  private buildTestTree(tests: TestDescription[]) {
    const tree: any = { children: new Map(), tests: [] }
    
    for (const test of tests) {
      let currentNode = tree
      
      // Navigate through the spec path to find/create the right node
      for (const pathSegment of test.specPath) {
        if (!currentNode.children.has(pathSegment)) {
          currentNode.children.set(pathSegment, { 
            children: new Map(), 
            tests: [], 
            specPath: [...currentNode.specPath || [], pathSegment] 
          })
        }
        currentNode = currentNode.children.get(pathSegment)
      }
      
      // Add the test to the current node
      currentNode.tests.push(test)
    }
    
    return tree
  }

  private async executeTestTree(node: any, hasOnlyTests: boolean, specPath: string[] = []) {
    // Execute before hooks for this level
    const beforeHooksForLevel = this.getHooksInScope(this.beforeHooks, specPath)
      .filter(hook => JSON.stringify(hook.specPath) === JSON.stringify(specPath))
    await this.executeHooks(beforeHooksForLevel)

    // Execute tests at this level
    for (const test of node.tests) {
      await this.runTest(test, hasOnlyTests)
      
      // If bail is enabled and a test has failed, stop execution
      if (this.options.bail && this.testResults.some((result) => !result.passed)) {
        return
      }
    }

    // Execute child nodes
    for (const [childName, childNode] of node.children) {
      await this.executeTestTree(childNode, hasOnlyTests, [...specPath, childName])
    }

    // Execute after hooks for this level (in reverse order compared to before hooks)
    const afterHooksForLevel = this.getHooksInScope(this.afterHooks, specPath)
      .filter(hook => JSON.stringify(hook.specPath) === JSON.stringify(specPath))
    await this.executeHooks(afterHooksForLevel)
  }

  private isHookInScope(hookSpecPath: string[], testSpecPath: string[]): boolean {
    // A hook is in scope if the test's spec path starts with the hook's spec path
    if (hookSpecPath.length > testSpecPath.length) {
      return false
    }
    
    for (let i = 0; i < hookSpecPath.length; i++) {
      if (hookSpecPath[i] !== testSpecPath[i]) {
        return false
      }
    }
    
    return true
  }

  private getHooksInScope(hooks: LifecycleHook[], testSpecPath: string[]): LifecycleHook[] {
    return hooks.filter(hook => this.isHookInScope(hook.specPath, testSpecPath))
  }

  private async executeHooks(hooks: LifecycleHook[]): Promise<void> {
    for (const hook of hooks) {
      await Promise.resolve().then(() => hook.fn())
    }
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
      // Execute beforeEach hooks
      const beforeEachHooksForTest = this.getHooksInScope(this.beforeEachHooks, test.specPath)
      await this.executeHooks(beforeEachHooksForTest)

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

      // Execute afterEach hooks
      const afterEachHooksForTest = this.getHooksInScope(this.afterEachHooks, test.specPath)
      await this.executeHooks(afterEachHooksForTest)
    } catch (error: unknown) {
      if (error instanceof TestError) {
        this.testResults.push({
          spec,
          error: error,
          passed: false,
          options: test.options
        })

        // Still execute afterEach hooks even if test failed
        try {
          const afterEachHooksForTest = this.getHooksInScope(this.afterEachHooks, test.specPath)
          await this.executeHooks(afterEachHooksForTest)
        } catch (hookError) {
          // If afterEach hook fails, we don't want to override the original test error
          console.error('afterEach hook failed:', hookError)
        }

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
