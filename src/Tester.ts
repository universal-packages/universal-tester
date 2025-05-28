import EventEmitter from 'events'

import { Assertion } from './Assertion'
import { TestError } from './TestError'
import { DescribeOptions, Test, TestOptions, TestResult, TesterOptions, TesterStatus, TestingNode } from './Tester.types'
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

export class Tester extends EventEmitter {
  public readonly options: TesterOptions

  private readonly testingTree: TestingNode
  private readonly currentTestingNodeStack: TestingNode[] = []
  private readonly testResults: TestResult[] = []
  private readonly testsSequence: Test[] = []
  private _internalStatus: TesterStatus = 'idle'

  private beforeOrAfterHooksOrTestFailed = false

  public get status() {
    return this._internalStatus
  }

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
    super()
    this.options = { bail: false, runOrder: 'sequence', timeout: 5000, ...options }
    this.testingTree = {
      name: Symbol('root'),
      describeOptions: { timeout: this.options.timeout },
      tests: [],
      children: [],
      completed: false,
      beforeHooks: [],
      beforeHooksErrors: [],
      beforeHooksHaveRun: false,
      beforeEachHooks: [],
      afterEachHooks: [],
      afterEachHooksErrors: [],
      afterHooks: [],
      afterHooksErrors: []
    }
    this.currentTestingNodeStack.push(this.testingTree)
  }

  public mockFn() {
    return createMockFunction()
  }

  public spyOn(object: any, propertyPath: string) {
    return spyOn(object, propertyPath)
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

    const describeNode: TestingNode = {
      name: descriptiveName,
      describeOptions: options || {},
      tests: [],
      children: [],
      parent: this.currentTestingNodeStack[this.currentTestingNodeStack.length - 1],
      completed: false,
      beforeHooks: [],
      beforeHooksErrors: [],
      beforeHooksHaveRun: false,
      beforeEachHooks: [],
      afterEachHooks: [],
      afterEachHooksErrors: [],
      afterHooks: [],
      afterHooksErrors: []
    }

    this.currentTestingNodeStack[this.currentTestingNodeStack.length - 1].children.push(describeNode)
    this.currentTestingNodeStack.push(describeNode)

    // Execute the function to register nested tests and describes
    fn()

    this.currentTestingNodeStack.pop()
  }

  public test(name: string, fn: () => void | Promise<void>, options?: TestOptions) {
    // Merge options from describe blocks (from outer to inner)
    const mergedOptions: TestOptions = { timeout: this.options.timeout }
    const describeOptionsStack = this.currentTestingNodeStack.map((node) => node.describeOptions)

    // Apply describe options from outermost to innermost
    for (const describeOpts of describeOptionsStack) {
      if (describeOpts.timeout !== undefined) mergedOptions.timeout = describeOpts.timeout
      if (describeOpts.only !== undefined) mergedOptions.only = describeOpts.only
      if (describeOpts.skip !== undefined) mergedOptions.skip = describeOpts.skip
      if (describeOpts.skipReason !== undefined) mergedOptions.skipReason = describeOpts.skipReason
    }

    // Test options take precedence over all describe options
    if (options) Object.assign(mergedOptions, options)

    const test: Test = {
      name,
      fn,
      options: mergedOptions,
      parent: this.currentTestingNodeStack[this.currentTestingNodeStack.length - 1],
      hasRun: false
    }

    this.testsSequence.push(test)
    this.currentTestingNodeStack[this.currentTestingNodeStack.length - 1].tests.push(test)
  }

  public before(fn: () => void | Promise<void>) {
    this.currentTestingNodeStack[this.currentTestingNodeStack.length - 1].beforeHooks.push(fn)
  }

  public beforeEach(fn: () => void | Promise<void>) {
    this.currentTestingNodeStack[this.currentTestingNodeStack.length - 1].beforeEachHooks.push(fn)
  }

  public after(fn: () => void | Promise<void>) {
    this.currentTestingNodeStack[this.currentTestingNodeStack.length - 1].afterHooks.push(fn)
  }

  public afterEach(fn: () => void | Promise<void>) {
    this.currentTestingNodeStack[this.currentTestingNodeStack.length - 1].afterEachHooks.push(fn)
  }

  public expect(value: any) {
    return new Assertion(value)
  }

  public async run() {
    if (this._internalStatus === 'running') {
      throw new Error('Tester is already running')
    } else if (this._internalStatus === 'success' || this._internalStatus === 'failure') {
      throw new Error('Tester has already completed')
    }

    this._internalStatus = 'running'

    // Check if any test has 'only' flag
    const hasOnlyTests = this.testsSequence.some((test) => test.options.only)

    // Make a copy of the test array
    const testsToRun = [...this.testsSequence]

    // Process tests based on their options and the tester's run order
    if (this.options.runOrder === 'random') {
      // Shuffle the array for random execution
      testsToRun.sort(() => Math.random() - 0.5)
    } else if (this.options.runOrder === 'parallel') {
      // For parallel execution, we'll pass the hasOnlyTests flag to runTest
      await Promise.all(testsToRun.map((test) => this.runTest(test, hasOnlyTests)))

      if (this.beforeOrAfterHooksOrTestFailed) {
        this._internalStatus = 'failure'
      } else {
        this._internalStatus = 'success'
      }

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

    if (this.beforeOrAfterHooksOrTestFailed) {
      this._internalStatus = 'failure'
    } else {
      this._internalStatus = 'success'
    }

    return this.testResults
  }

  private async runTest(test: Test, hasOnlyTests: boolean) {
    const nodePath: TestingNode[] = []
    let currentNode: TestingNode | undefined = test.parent

    while (currentNode) {
      nodePath.push(currentNode)
      currentNode = currentNode.parent
    }

    const spec: string[] = [test.name]

    for (const node of nodePath) {
      if (node.name.toString() !== Symbol('root').toString()) spec.unshift(node.name.toString())
    }

    const hasBeforeHooksErrors = nodePath.some((node) => node.beforeHooksErrors.length > 0)

    if (hasBeforeHooksErrors) {
      this.testResults.push({
        spec,
        passed: false,
        options: test.options,
        error: new TestError({
          message: 'Can not run if before hooks fail',
          messageLocals: {},
          expected: 'Before hooks to not fail',
          actual: 'Before hooks failed'
        })
      })
      return
    }

    const shouldSkip = test.options.skip || (hasOnlyTests && !test.options.only)
    const skipReason = test.options.skipReason || (hasOnlyTests && !test.options.only ? '"only" tests are active' : undefined)

    // If the test should be skipped, record the result without executing
    if (shouldSkip) {
      test.hasRun = true
      this.testResults.push({
        spec,
        passed: true,
        options: test.options,
        skipped: true,
        skipReason: skipReason
      })

      for (const node of nodePath) {
        const allTestsCompleted = node.tests.every((test) => test.hasRun)
        const allNodesCompleted = node.children.every((node) => node.completed)

        if (allTestsCompleted && allNodesCompleted) {
          node.completed = true
        }
      }

      for (const node of nodePath) {
        if (node.completed) {
          for (const hook of node.afterHooks) {
            try {
              await hook()
            } catch (error: unknown) {
              this.beforeOrAfterHooksOrTestFailed = true
              node.afterHooksErrors.push(error as Error)
            }
          }
        }
      }

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

      // Run all before hooks for each node in the path
      for (const node of nodePath.slice().reverse()) {
        if (!node.beforeHooksHaveRun) {
          node.beforeHooksHaveRun = true

          for (const hook of node.beforeHooks) {
            try {
              await hook()
            } catch (error: unknown) {
              node.beforeHooksErrors.push(error as Error)
            }
          }

          if (node.beforeHooksErrors.length > 0) {
            this.beforeOrAfterHooksOrTestFailed = true

            this.testResults.push({
              spec,
              passed: false,
              options: test.options,
              error: new TestError({
                message: 'Can not run if before hooks fail',
                messageLocals: {},
                expected: 'Before hooks to not fail',
                actual: 'Before hooks failed'
              })
            })

            return
          }
        }
      }

      // Now we run all beforeEach hooks for each node in the path they all have to run
      for (const node of nodePath.slice().reverse()) {
        for (const hook of node.beforeEachHooks) {
          try {
            await hook()
          } catch (error: unknown) {
            throw new TestError({
              message: error instanceof Error ? error.message : 'Unknown error',
              messageLocals: {},
              expected: 'BeforeEach hook to not fail',
              actual: 'BeforeEach hook failed'
            })
          }
        }
      }

      try {
        await Promise.race([Promise.resolve().then(() => test.fn()), timeoutPromise])
      } catch (error: unknown) {
        throw error
      } finally {
        test.hasRun = true

        for (const node of nodePath) {
          const allTestsCompleted = node.tests.every((test) => test.hasRun)
          const allNodesCompleted = node.children.every((node) => node.completed)

          if (allTestsCompleted && allNodesCompleted) {
            node.completed = true
          }
        }
      }

      // If we get here, the test passed
      this.testResults.push({
        spec,
        passed: true,
        options: test.options
      })
    } catch (error: unknown) {
      this.beforeOrAfterHooksOrTestFailed = true

      this.testResults.push({
        spec,
        error: error as TestError,
        passed: false,
        options: test.options
      })
    } finally {
      // Clear the timeout to prevent memory leaks
      if (timeoutId) clearTimeout(timeoutId)

      // Now we run all afterEach hooks for each node in the path they all have to run
      for (const node of nodePath.slice().reverse()) {
        for (const hook of node.afterEachHooks) {
          try {
            await hook()
          } catch (error: unknown) {
            this.beforeOrAfterHooksOrTestFailed = true
            node.afterEachHooksErrors.push(error as Error)
          }
        }
      }

      for (const node of nodePath) {
        if (node.completed) {
          for (const hook of node.afterHooks) {
            try {
              await hook()
            } catch (error: unknown) {
              this.beforeOrAfterHooksOrTestFailed = true
              node.afterHooksErrors.push(error as Error)
            }
          }
        }
      }
    }
  }
}
